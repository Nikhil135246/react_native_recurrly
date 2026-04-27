import "@/global.css";
import { StatusBar } from "expo-status-bar";
import { FlatList, Image, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

import ListHeading from "@/components/ListHeading";
import SubscriptionCard from "@/components/SubscriptionCard";
import UpcomingSubscriptionCard from "@/components/UpcomingSubscriptionCard";
import { HOME_BALANCE, HOME_SUBSCRIPTIONS, HOME_USER, UPCOMING_SUBSCRIPTIONS } from "@/constants/data";
import { icons } from "@/constants/icons";
import images from "@/constants/images";
import { formatCurrency } from "@/lib/utils";
import dayjs from "dayjs";
import { styled } from "nativewind";
import React, { useState } from "react";
// reason to do that , SAV is from react-native-safe-area-context and it doesn't support className prop, so we need to wrap it with styled from nativewind to use className prop on it.

// check readmenote for detial explanation about this issue : Why `className` didn't work on `SafeAreaView`
const SafeAreaView = styled(RNSafeAreaView);

export default function App() {

  const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<string | null>(null);
  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <StatusBar style="dark" />
      <FlatList
        ListHeaderComponent={() => (
          <>
            <View className="home-header">
              <View className="home-user">
                <Image source={images.profile} className="home-avatar" />
                <Text className="home-user-name" numberOfLines={1} ellipsizeMode="tail">
                  {HOME_USER.firstname} {HOME_USER.lastname}
                </Text>
              </View>
              <Image source={icons.plus2} className="home-add-icon" />
            </View>

            <View className="home-balance-card">
              <Text className="home-balance-label">Balance</Text>
              <View className="home-balance-row">
                <Text className="home-balance-amount"> {formatCurrency(HOME_BALANCE.amount)}</Text>
                <Text className="home-balance-date pl-1">
                  {HOME_BALANCE.nextRenewalDate
                    ? dayjs(HOME_BALANCE.nextRenewalDate).format("MMM-D")
                    : ""}
                </Text>
              </View>
            </View>

            <View className="mb-5">
              <ListHeading title="Upcoming Renewals" />

              <FlatList data={UPCOMING_SUBSCRIPTIONS}
                renderItem={({ item }) => (<UpcomingSubscriptionCard {...item} />)}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                ListEmptyComponent={<Text className="home-empty-state">No upcoming subscriptions</Text>} />

            </View>
        <ListHeading title="All Subscriptions" />

          </>
        )}
        data={HOME_SUBSCRIPTIONS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SubscriptionCard
            {...item}
            expanded={expandedSubscriptionId === item.id}
            onPress={() => setExpandedSubscriptionId((currentId) => (currentId === item.id ? null : item.id))}
          />
        )}
        extraData={expandedSubscriptionId}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View className="h-4" />}
        ListEmptyComponent={<Text className="home-empty-state">No subscriptions yet.</Text>}
        contentContainerClassName="pb-24"
      />


    </SafeAreaView>
  );
}