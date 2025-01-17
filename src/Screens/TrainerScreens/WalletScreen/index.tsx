import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, ScrollView, Pressable, ActivityIndicator, Linking } from "react-native";
import Entypo from "react-native-vector-icons/Entypo";
import moment from "moment";
import { RFValue } from "react-native-responsive-fontsize";
import Header from "../../../Components/Header";
import Button from "../../../Components/Button";
import Container from "../../../Components/Container";
import Colors from "../../../constants/Colors";
import Typography from "../../../Components/typography/text";
import { useSelector } from "react-redux";
import { useConnectAccountLinkMutation, useGetStripeUserQuery, useGetUserMeQuery, useStripeTransferMutation } from "../../../slice/FitsApi.slice";
import { NavigationSwitchProp } from "react-navigation";
import { StripeCustomerInterface, UserDetail, Transaction } from "../../../interfaces";

interface Props {
  navigation: NavigationSwitchProp;
}

const WalletScreen: React.FC<Props> = ({ navigation }) => {
  const [details, setDetails] = useState(false);
  const { data: userMeData, isLoading: isGetUserMe } = useGetUserMeQuery({});
  const [cardData, setCardData] = useState<StripeCustomerInterface | null>();
  const { refetch: refetchStripeUser, isLoading } = useGetStripeUserQuery(userMeData?.stripe?.card?.customer || "");
  const [connectAccountLink, { data, isLoading: isLoading1, error: connectionAccountLinkError }] = useConnectAccountLinkMutation();
  const [stripeTransferAmount, { data: stripeTransfer, isLoading: isStripeTransferAmount, error }] = useStripeTransferMutation();
  console.log("error", stripeTransfer);
  useEffect(() => {
    navigation.addListener("focus", () => {
      getStripeCard();
    });
  }, []);

  useEffect(() => {
    handleTransferBalance();
  }, [connectionAccountLinkError]);

  const getStripeCard = async () => {
    try {
      const result = await refetchStripeUser();
      if (result?.data) setCardData(result.data.data);
    } catch (error) {
      // Handle error here
    }
  };
  console.log("userMeData?.user", connectionAccountLinkError?.data.data.id);
  const handleTransferBalance = async () => {
    const body = {
      amount: cardData?.balance,
      currency: "USD",
    };

    if (connectionAccountLinkError?.data.data) {
      const stripeTransferResponse = await stripeTransferAmount({ id: connectionAccountLinkError?.data.data.id, body }).unwrap();
      console.log("stripeTransferResponse", stripeTransferResponse);
    }
  };

  const handleWithDrawFunds = async () => {
    const body = {
      email: userMeData?.user?.email,
      type: "express",
      country: userMeData?.stripe?.card?.country,
    };
    const responseConnectAccountLink: any = await connectAccountLink(body).unwrap();
    if (responseConnectAccountLink.data.url) {
      await Linking.openURL(responseConnectAccountLink.data.url);
    } else {
      navigation.navigate("WalletForTrainee");
    }
  };

  // Render transaction history
  const renderTransactionHistory = (transactions: Transaction[] | undefined) => {
    if (!transactions) return null;
    return transactions.map((transaction, index) => (
      <View key={index} style={styles.transactionItem}>
        <View style={styles.dateView}>
          <Typography color="white" size="heading4" weight="500">
            {moment(transaction.createdAt).format("DD-MMMM")}
          </Typography>
        </View>
        <View style={styles.separator} />
        <View style={styles.transactionInfo}>
          <Text style={styles.transactionText}>
            {transaction.name}
            <Text style={styles.transactionDetail}>{`\n          ${transaction.description}`}</Text>
          </Text>
        </View>
        <Pressable onPress={() => setDetails(!details)} style={styles.detailsButton}>
          <View style={styles.detailsButtonView}>
            <Text style={styles.detailsButtonText}>Details</Text>
            <Entypo name={details ? "chevron-up" : "chevron-down"} size={18} color={"#fff"} />
          </View>
        </Pressable>
      </View>
    ));
  };

  if (isLoading || isLoading1 || isStripeTransferAmount || isGetUserMe) return <ActivityIndicator />;

  return (
    <Container>
      <Header label={"Wallet"} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.walletBoxTextView}>
          <Typography color="white" size="heading1">
            Total balance
          </Typography>
          <Typography color="white" size="heading1" weight="900">
            $ {cardData?.balance ?? 0}
          </Typography>
        </View>
        <View style={styles.transactionHistoryView}>{renderTransactionHistory(userMeData?.transactions)}</View>
      </ScrollView>
      <Button disabled={!cardData?.balance} style={{ marginBottom: 10 }} label={"Withdraw Funds"} onPress={() => handleWithDrawFunds()} />
    </Container>
  );
};

const styles = StyleSheet.create({
  walletBoxTextView: {
    justifyContent: "center",
    alignItems: "center",
    rowGap: 15,
    backgroundColor: Colors.black,
    borderRadius: 12,
    height: 150,
  },
  transactionHistoryView: {
    marginTop: 20,
    width: "100%",
    backgroundColor: "#000",
    justifyContent: "center",
    borderRadius: 12,
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 9,
  },
  dateView: {
    width: "20%",
    alignItems: "center",
    backgroundColor: "red",
  },
  separator: {
    width: 2,
    height: 50,
    backgroundColor: "#fff",
  },
  transactionInfo: {
    width: "35%",
    flexDirection: "column",
  },
  transactionText: {
    color: "#fff",
    fontSize: RFValue(12, 580),
    fontFamily: "Poppins-SemiBold",
  },
  transactionDetail: {
    color: "#fff",
    fontSize: RFValue(10, 580),
    fontFamily: "Poppins-Regular",
  },
  detailsButton: {
    width: "30%",
    backgroundColor: "#414143",
    alignItems: "center",
    borderRadius: 12,
    height: 50,
    justifyContent: "center",
  },
  detailsButtonView: {
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
  },
  detailsButtonText: {
    color: "#fff",
    fontSize: RFValue(14, 580),
    fontFamily: "Poppins-Regular",
    textAlign: "center",
  },
});

export default WalletScreen;
