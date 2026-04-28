import { useSignUp } from "@clerk/expo";
import { type Href, Link, useRouter } from "expo-router";
import { styled } from "nativewind";
import React, { useMemo, useState } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

type LocalErrors = {
  firstName?: string;
  lastName?: string;
  emailAddress?: string;
  password?: string;
  code?: string;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_REGEX = /^[a-zA-Z\s'-]{2,}$/;

const getClerkFieldError = (errors: unknown, key: string): string | undefined => {
  if (!errors || typeof errors !== "object") {
    return undefined;
  }

  const maybeObject = errors as Record<string, unknown>;
  const fields = maybeObject.fields as Record<string, { message?: string }> | undefined;
  return fields?.[key]?.message;
};

const getClerkGlobalError = (errors: unknown): string | undefined => {
  if (!errors || typeof errors !== "object") {
    return undefined;
  }

  const maybeObject = errors as Record<string, unknown>;
  const message = maybeObject.message;

  if (typeof message === "string" && message.trim().length > 0) {
    return message;
  }

  return undefined;
};

const SignUp = () => {
  const { signUp, errors, fetchStatus } = useSignUp();
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [localErrors, setLocalErrors] = useState<LocalErrors>({});
  const [isSendingEmailCode, setIsSendingEmailCode] = useState(false);

  const isLoading = fetchStatus === "fetching";
  const requiresVerification =
    signUp.status === "missing_requirements" &&
    signUp.unverifiedFields.includes("email_address") &&
    signUp.missingFields.length === 0;

  const validationErrors = useMemo(() => {
    const nextErrors: LocalErrors = {};

    if (requiresVerification) {
      if (!code.trim()) {
        nextErrors.code = "Enter the verification code sent to your email.";
      } else if (!/^\d{6}$/.test(code.trim())) {
        nextErrors.code = "Enter a valid 6-digit code.";
      }
      return nextErrors;
    }

    if (!firstName.trim()) {
      nextErrors.firstName = "First name is required.";
    } else if (!NAME_REGEX.test(firstName.trim())) {
      nextErrors.firstName = "Enter a valid first name.";
    }

    if (!lastName.trim()) {
      nextErrors.lastName = "Last name is required.";
    } else if (!NAME_REGEX.test(lastName.trim())) {
      nextErrors.lastName = "Enter a valid last name.";
    }

    if (!emailAddress.trim()) {
      nextErrors.emailAddress = "Email address is required.";
    } else if (!EMAIL_REGEX.test(emailAddress.trim())) {
      nextErrors.emailAddress = "Enter a valid email address.";
    }

    if (!password) {
      nextErrors.password = "Password is required.";
    } else if (password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters.";
    } else if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
      nextErrors.password = "Use at least one letter and one number.";
    }

    return nextErrors;
  }, [code, emailAddress, firstName, lastName, password, requiresVerification]);

  const finalizeSession = async () => {
    await signUp.finalize({
      navigate: ({ session, decorateUrl }) => {
        if (session?.currentTask) {
          setGlobalError("Additional account checks are required. Please try again shortly.");
          return;
        }

        const url = decorateUrl("/(tabs)");
        if (Platform.OS === "web" && url.startsWith("http")) {
          window.location.href = url;
          return;
        }

        router.replace(url as Href);
      },
    });
  };

  const handleSubmit = async () => {
    setGlobalError(null);
    setLocalErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      const { error } = await signUp.password({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        emailAddress: emailAddress.trim().toLowerCase(),
        password,
      });

      if (error) {
        setGlobalError("We could not create your account. Please review your details.");
        return;
      }

      await handleSendEmailCode();
    } catch {
      setGlobalError("Something went wrong. Please try again.");
    }
  };

  const handleSendEmailCode = async () => {
    setGlobalError(null);
    setIsSendingEmailCode(true);

    try {
      await signUp.verifications.sendEmailCode();
    } catch (err) {
      setGlobalError("Failed to send verification code. Please try again.");
      // eslint-disable-next-line no-console
      console.error("sendEmailCode error:", err);
    } finally {
      setIsSendingEmailCode(false);
    }
  };

  const handleVerify = async () => {
    setGlobalError(null);
    setLocalErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      await signUp.verifications.verifyEmailCode({ code: code.trim() });

      if (signUp.status === "complete") {
        await finalizeSession();
        return;
      }

      setGlobalError("Verification is not complete yet. Please check your code and retry.");
    } catch {
      setGlobalError("Invalid or expired code. Request a new code and try again.");
    }
  };

  const primaryDisabled = isLoading || Object.keys(validationErrors).length > 0;

  return (
    <SafeAreaView className="auth-safe-area">
      <KeyboardAvoidingView
        className="auth-screen"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView className="auth-scroll" keyboardShouldPersistTaps="handled">
          <View className="auth-content">
            <View className="auth-brand-block">
              <View className="auth-logo-wrap">
                <View className="auth-logo-mark">
                  <Text className="auth-logo-mark-text">R</Text>
                </View>
                <View>
                  <Text className="auth-wordmark">Recurly</Text>
                  <Text className="auth-wordmark-sub">Smart Billing</Text>
                </View>
              </View>

              <Text className="auth-title">Create your account</Text>
              <Text className="auth-subtitle">
                Stay on top of every renewal with secure access to your billing dashboard
              </Text>
            </View>

            <View className="auth-card">
              {requiresVerification ? (
                <View className="auth-form">
                  <View className="auth-field">
                    <Text className="auth-label">Verification code</Text>
                    <TextInput
                      className={`auth-input ${
                        localErrors.code || getClerkFieldError(errors, "code")
                          ? "auth-input-error"
                          : ""
                      }`}
                      value={code}
                      placeholder="Enter 6-digit code"
                      placeholderTextColor="rgba(0,0,0,0.5)"
                      onChangeText={(value) => {
                        setCode(value);
                        if (localErrors.code) {
                          setLocalErrors((prev) => ({ ...prev, code: undefined }));
                        }
                      }}
                      keyboardType="numeric"
                      maxLength={6}
                    />
                    {(localErrors.code || getClerkFieldError(errors, "code")) && (
                      <Text className="auth-error">
                        {localErrors.code || getClerkFieldError(errors, "code")}
                      </Text>
                    )}
                  </View>

                  <Pressable
                    className={`auth-button ${primaryDisabled ? "auth-button-disabled" : ""}`}
                    disabled={primaryDisabled}
                    onPress={handleVerify}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="#081126" />
                    ) : (
                      <Text className="auth-button-text">Verify and continue</Text>
                    )}
                  </Pressable>

                  <Pressable
                    className="auth-secondary-button"
                    disabled={isSendingEmailCode || isLoading}
                    onPress={handleSendEmailCode}
                  >
                    {isSendingEmailCode ? (
                      <ActivityIndicator color="#081126" />
                    ) : (
                      <Text className="auth-secondary-button-text">Send a new code</Text>
                    )}
                  </Pressable>
                </View>
              ) : (
                <View className="auth-form">
                  <View className="flex-row gap-3">
                    <View className="auth-field flex-1">
                      <Text className="auth-label">First name</Text>
                      <TextInput
                        className={`auth-input ${
                          localErrors.firstName || getClerkFieldError(errors, "firstName")
                            ? "auth-input-error"
                            : ""
                        }`}
                        value={firstName}
                        placeholder="First name"
                        placeholderTextColor="rgba(0,0,0,0.5)"
                        onChangeText={(value) => {
                          setFirstName(value);
                          if (localErrors.firstName) {
                            setLocalErrors((prev) => ({ ...prev, firstName: undefined }));
                          }
                        }}
                      />
                      {(localErrors.firstName || getClerkFieldError(errors, "firstName")) && (
                        <Text className="auth-error">
                          {localErrors.firstName || getClerkFieldError(errors, "firstName")}
                        </Text>
                      )}
                    </View>

                    <View className="auth-field flex-1">
                      <Text className="auth-label">Last name</Text>
                      <TextInput
                        className={`auth-input ${
                          localErrors.lastName || getClerkFieldError(errors, "lastName")
                            ? "auth-input-error"
                            : ""
                        }`}
                        value={lastName}
                        placeholder="Last name"
                        placeholderTextColor="rgba(0,0,0,0.5)"
                        onChangeText={(value) => {
                          setLastName(value);
                          if (localErrors.lastName) {
                            setLocalErrors((prev) => ({ ...prev, lastName: undefined }));
                          }
                        }}
                      />
                      {(localErrors.lastName || getClerkFieldError(errors, "lastName")) && (
                        <Text className="auth-error">
                          {localErrors.lastName || getClerkFieldError(errors, "lastName")}
                        </Text>
                      )}
                    </View>
                  </View>

                  <View className="auth-field">
                    <Text className="auth-label">Email</Text>
                    <TextInput
                      className={`auth-input ${
                        localErrors.emailAddress || getClerkFieldError(errors, "emailAddress")
                          ? "auth-input-error"
                          : ""
                      }`}
                      value={emailAddress}
                      placeholder="Enter your email"
                      placeholderTextColor="rgba(0,0,0,0.5)"
                      autoCapitalize="none"
                      autoCorrect={false}
                      keyboardType="email-address"
                      onChangeText={(value) => {
                        setEmailAddress(value);
                        if (localErrors.emailAddress) {
                          setLocalErrors((prev) => ({ ...prev, emailAddress: undefined }));
                        }
                      }}
                    />
                    {(localErrors.emailAddress || getClerkFieldError(errors, "emailAddress")) && (
                      <Text className="auth-error">
                        {localErrors.emailAddress || getClerkFieldError(errors, "emailAddress")}
                      </Text>
                    )}
                  </View>

                  <View className="auth-field">
                    <Text className="auth-label">Password</Text>
                    <TextInput
                      className={`auth-input ${
                        localErrors.password || getClerkFieldError(errors, "password")
                          ? "auth-input-error"
                          : ""
                      }`}
                      value={password}
                      placeholder="Create a password"
                      placeholderTextColor="rgba(0,0,0,0.5)"
                      secureTextEntry
                      onChangeText={(value) => {
                        setPassword(value);
                        if (localErrors.password) {
                          setLocalErrors((prev) => ({ ...prev, password: undefined }));
                        }
                      }}
                    />
                    {(localErrors.password || getClerkFieldError(errors, "password")) && (
                      <Text className="auth-error">
                        {localErrors.password || getClerkFieldError(errors, "password")}
                      </Text>
                    )}
                    <Text className="auth-helper">Use at least 8 characters with letters and numbers.</Text>
                  </View>

                  <Pressable
                    className={`auth-button ${primaryDisabled ? "auth-button-disabled" : ""}`}
                    disabled={primaryDisabled}
                    onPress={handleSubmit}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="#081126" />
                    ) : (
                      <Text className="auth-button-text">Create account</Text>
                    )}
                  </Pressable>

                  <View className="auth-divider-row">
                    <View className="auth-divider-line" />
                    <Text className="auth-divider-text">Trusted setup</Text>
                    <View className="auth-divider-line" />
                  </View>

                  <View className="flex-row items-center justify-center gap-1">
                    <Text className="auth-helper">Already have an account?</Text>
                    <Link href="/(auth)/sign-in">
                      <Text className="font-sans-bold text-accent">Sign in</Text>
                    </Link>
                  </View>

                  <View nativeID="clerk-captcha" />
                </View>
              )}

              {(globalError || getClerkGlobalError(errors)) && (
                <Text className="mt-4 text-center text-xs font-sans-medium text-destructive">
                  {globalError || getClerkGlobalError(errors)}
                </Text>
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignUp;