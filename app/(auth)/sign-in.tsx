import { useSignIn } from "@clerk/expo";
import { type Href, Link, useRouter } from "expo-router";
import { styled } from "nativewind";
import React, { useEffect, useMemo, useState } from "react";
import { usePostHog } from "posthog-react-native";
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
  emailAddress?: string;
  password?: string;
  code?: string;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

const SignIn = () => {
  const { signIn, errors, fetchStatus } = useSignIn();
  const router = useRouter();
  const posthog = usePostHog();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [localErrors, setLocalErrors] = useState<LocalErrors>({});
  const [selectedFactor, setSelectedFactor] = useState<string | undefined>(undefined);

  const isLoading = fetchStatus === "fetching";
  const requiresVerification = signIn.status === "needs_client_trust";
  const needsSecondFactor = signIn.status === "needs_second_factor";

  const validationErrors = useMemo(() => {
    const nextErrors: LocalErrors = {};

    if (requiresVerification || needsSecondFactor) {
      if (!code.trim()) {
        nextErrors.code = "Enter the verification code sent to your email.";
      } else if (!/^\d{6}$/.test(code.trim())) {
        nextErrors.code = "Enter a valid 6-digit code.";
      }

      return nextErrors;
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
    }

    return nextErrors;
  }, [code, emailAddress, password, requiresVerification, needsSecondFactor]);

  useEffect(() => {
    if (needsSecondFactor && !selectedFactor) {
      setSelectedFactor(signIn.supportedSecondFactors?.[0]?.strategy);
    }
  }, [needsSecondFactor, signIn.supportedSecondFactors, selectedFactor]);

  const finalizeSession = async () => {
    await signIn.finalize({
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
      const { error } = await signIn.password({
        emailAddress: emailAddress.trim().toLowerCase(),
        password,
      });

      if (error) {
        setGlobalError("We could not sign you in. Please review your details and try again.");
        try {
          posthog?.capture?.("user_sign_in_failed", { message: getClerkGlobalError(error) ?? "password_error" });
        } catch {}
        return;
      }

      if (signIn.status === "complete") {
        try {
          posthog?.capture?.("user_signed_in");
        } catch {}
        await finalizeSession();
      } else if (signIn.status === "needs_client_trust") {
        const emailCodeFactor = signIn.supportedSecondFactors?.find(
          (factor) => factor.strategy === "email_code",
        );

        if (emailCodeFactor) {
          await signIn.mfa.sendEmailCode();
        } else {
          setGlobalError("Email verification is currently unavailable for this account.");
        }
      } else if (signIn.status === "needs_second_factor") {
        const firstFactor = signIn.supportedSecondFactors?.[0];

        if (!firstFactor) {
          setGlobalError("Multi-factor authentication is required but no factors are available.");
          return;
        }

        // default selected factor if not set
        setSelectedFactor((prev) => prev ?? firstFactor.strategy);

        // send a code for factors that need a code to be sent
        if (firstFactor.strategy === "email_code") {
          await signIn.mfa.sendEmailCode();
        } else if (firstFactor.strategy === "phone_code") {
          await signIn.mfa.sendPhoneCode();
        }
      } else {
        setGlobalError("We need a little more information before signing you in.");
      }
    } catch {
      setGlobalError("Something went wrong. Please try again.");
    }
  };

  const handleVerify = async () => {
    setGlobalError(null);
    setLocalErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      if (requiresVerification) {
        await signIn.mfa.verifyEmailCode({ code: code.trim() });
      } else if (needsSecondFactor) {
        // route verification by selected factor
        if (selectedFactor === "totp") {
          // TOTP verification (time-based OTP)
          // Clerk's SDK exposes verifyTotp
          // @ts-ignore
          await signIn.mfa.verifyTotp({ code: code.trim() });
        } else if (selectedFactor === "phone_code") {
          // verify phone code
          // @ts-ignore
          await signIn.mfa.verifyPhoneCode({ code: code.trim() });
        } else if (selectedFactor === "email_code") {
          await signIn.mfa.verifyEmailCode({ code: code.trim() });
        } else {
          throw new Error("Unsupported MFA factor");
        }
      }

      if (signIn.status === "complete") {
        try {
          posthog?.capture?.("user_signed_in");
        } catch {}
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

              <Text className="auth-title">Welcome back</Text>
              <Text className="auth-subtitle">Sign in to continue managing your subscriptions</Text>
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
                    disabled={isLoading}
                    onPress={() => signIn.mfa.sendEmailCode()}
                  >
                    <Text className="auth-secondary-button-text">Send a new code</Text>
                  </Pressable>

                  <Pressable
                    className="auth-secondary-button"
                    disabled={isLoading}
                    onPress={() => signIn.reset()}
                  >
                    <Text className="auth-secondary-button-text">Start over</Text>
                  </Pressable>
                </View>
              ) : needsSecondFactor ? (
                <View className="auth-form">
                  <View className="mb-3">
                    <Text className="auth-label">Choose verification method</Text>
                    <View className="flex-row gap-2 mt-2">
                      {signIn.supportedSecondFactors?.map((factor) => (
                        <Pressable
                          key={factor.strategy}
                          className={`px-3 py-2 rounded border ${
                            selectedFactor === factor.strategy ? "border-accent" : "border-gray-200"
                          }`}
                          onPress={() => setSelectedFactor(factor.strategy)}
                        >
                          <Text>
                            {factor.strategy === "totp"
                              ? "Authenticator app"
                              : factor.strategy === "phone_code"
                              ? "SMS"
                              : factor.strategy === "email_code"
                              ? "Email"
                              : factor.strategy}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  </View>

                  <View className="auth-field">
                    <Text className="auth-label">Verification code</Text>
                    <TextInput
                      className={`auth-input ${
                        localErrors.code || getClerkFieldError(errors, "code") ? "auth-input-error" : ""
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
                      <Text className="auth-error">{localErrors.code || getClerkFieldError(errors, "code")}</Text>
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
                    disabled={isLoading}
                    onPress={() => {
                      if (selectedFactor === "phone_code") {
                        // @ts-ignore
                        signIn.mfa.sendPhoneCode();
                      } else if (selectedFactor === "email_code") {
                        signIn.mfa.sendEmailCode();
                      }
                    }}
                  >
                    <Text className="auth-secondary-button-text">Send a new code</Text>
                  </Pressable>

                  <Pressable
                    className="auth-secondary-button"
                    disabled={isLoading}
                    onPress={() => signIn.reset()}
                  >
                    <Text className="auth-secondary-button-text">Start over</Text>
                  </Pressable>
                </View>
              ) : (
                <View className="auth-form">
                  <View className="auth-field">
                    <Text className="auth-label">Email</Text>
                    <TextInput
                      className={`auth-input ${
                        localErrors.emailAddress ||
                        getClerkFieldError(errors, "identifier") ||
                        getClerkFieldError(errors, "emailAddress")
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
                    {(localErrors.emailAddress ||
                      getClerkFieldError(errors, "identifier") ||
                      getClerkFieldError(errors, "emailAddress")) && (
                      <Text className="auth-error">
                        {localErrors.emailAddress ||
                          getClerkFieldError(errors, "identifier") ||
                          getClerkFieldError(errors, "emailAddress")}
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
                      placeholder="Enter your password"
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
                  </View>

                  <Pressable
                    className={`auth-button ${primaryDisabled ? "auth-button-disabled" : ""}`}
                    disabled={primaryDisabled}
                    onPress={handleSubmit}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="#081126" />
                    ) : (
                      <Text className="auth-button-text">Sign in</Text>
                    )}
                  </Pressable>

                  <View className="auth-divider-row">
                    <View className="auth-divider-line" />
                    <Text className="auth-divider-text">Secure access</Text>
                    <View className="auth-divider-line" />
                  </View>

                  <View className="flex-row items-center justify-center gap-1">
                    <Text className="auth-helper">New to Recurly?</Text>
                    <Link href="/(auth)/sign-up">
                      <Text className="font-sans-bold text-accent">Create an account</Text>
                    </Link>
                  </View>
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

export default SignIn;