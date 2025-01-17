import React, { useEffect, useState } from "react";
import { View, StatusBar } from "react-native";
import FastImage from "react-native-fast-image";
import styles from "./styles";
import { useGetUserMeQuery, useStripeCustomerMutation } from "../../../slice/FitsApi.slice";
import { storeUserDataInAsyncStorage } from "../../../utils/async-storage";
import { NavigationSwitchProp } from "react-navigation";
import { errorToast } from "../../../utils/toast";
import { UserMeApiResponse } from "../../../slice/store.interface";
import { onLogout } from "../../../utils/logout";
import { useDispatch } from "react-redux";

interface PropsInterface {
  navigation: NavigationSwitchProp;
}

const CheckUser = ({ navigation }: PropsInterface) => {
  const dispatch = useDispatch();
  const { refetch: getUserInfoFromUserMe, isLoading } = useGetUserMeQuery({});
  const [userInfo, setUserInfo] = useState<UserMeApiResponse>() as any;
  const [stripeCustomer] = useStripeCustomerMutation({});

  const setDataInAsyncStorageAndUpdateState = async (data: UserMeApiResponse) => {
    await storeUserDataInAsyncStorage(JSON.stringify(data));
    setUserInfo(data);
    navigation.navigate("CheckUser");
  };

  const handleGetUserFromUserMeApi = async () => {
    try {
      let result = await getUserInfoFromUserMe();
      if (result.data) {
        if (!result.data?.user.cus_id && result.data?.profile_status.step_3) {
          createStripeAccount(result.data?.personal_info.name, result.data?.user.email, result.data?.personal_info.phoneNumber);
        } else {
          await setDataInAsyncStorageAndUpdateState(result.data);
        }
      }
    } catch (error: any) {
      errorToast("Login again due to some crashes");
      onLogout();
    }
  };

  const createStripeAccount = async (name: string, email: string, phone: string) => {
    const body = { name, email, phone };
    const result: any = await stripeCustomer(body);
    if (result?.error) errorToast(result?.error?.data?.message);
    else handleGetUserFromUserMeApi();
  };
  useEffect(() => {
    navigation.addListener("focus", () => {
      handleGetUserFromUserMeApi();
    });
  }, [navigation]);

  useEffect(() => {
    if (userInfo) {
      getUserInfo(userInfo?.profile_status);
    }
  }, [userInfo]);

  const getUserInfo = async (profile_status: { step_1: boolean; step_2: boolean; step_3: boolean;}) => {
    if (userInfo === null) {
      navigation.navigate("Welcome");
    } else {
      if (userInfo.user.role === "trainer") {
        if (profile_status?.step_1 === false) {
          navigation.navigate("PersonalInfo");
        } else if (profile_status?.step_2 === false) {
          navigation.navigate("ProfessionalInfo");
        } else if (profile_status?.step_3 === false) {
          navigation.navigate("ServicesOffered");
        } else {
          navigation.navigate("TrainerTabb");
        }
      } else if (userInfo.user.role === "trainee") {
        if (profile_status?.step_1 === false) {
          navigation.navigate("PersonalInfo");
        } else if (profile_status?.step_2 === false) {
          navigation.navigate("FitnessLevel");
        } else if (profile_status?.step_3 === false) {
          navigation.navigate("FitnessGoal");
        } else {
          navigation.navigate("TraineeTabb");
        }
      }
    }
  };

  return (
    <>
      {isLoading && (
        <>
          <StatusBar backgroundColor="#000" />
          <View style={styles.mainContainer}>
            <FastImage
              style={{
                width: 50,
                height: 50,
              }}
              source={{
                uri: "https://i.gifer.com/ZZ5H.gif",
                headers: { Authorization: "someAuthToken" },
                priority: FastImage.priority.normal,
              }}
              resizeMode={FastImage.resizeMode.cover}
            />
          </View>
        </>
      )}
    </>
  );
};

export default CheckUser;
