import React, { useState, useEffect } from "react";
import { Text, View, TouchableOpacity, Image, ScrollView, PermissionsAndroid, StyleSheet, Platform } from "react-native";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import AntDesign from "react-native-vector-icons/AntDesign";
import Classes from "../ClassesScreen";
import Reviews from "../Reviews";
import Geolocation from "react-native-geolocation-service";
import { useDispatch } from "react-redux";
import { NavigationSwitchProp } from "react-navigation";
import Container from "../../../Components/Container";
import Colors from "../../../constants/Colors";
import { RFValue } from "react-native-responsive-fontsize";
import { setLocationState } from "../../../slice/location.slice";
import Header from "../../../Components/Header";
import { useGetUserMeQuery } from "../../../slice/FitsApi.slice";
import FullPageLoader from "../../../Components/FullpageLoader";

interface Props {
  navigation: NavigationSwitchProp;
}

const Home: React.FC<Props> = ({ navigation }) => {
  // Hooks
  const dispatch = useDispatch();
  const { data: userMeData, isLoading, error } = useGetUserMeQuery({});

  const [classes, setClasses] = useState(true);
  const [reviews, setReviews] = useState(false);

  const classestrueState = () => {
    setClasses(true);
    setReviews(false);
  };

  const reviewstrueState = () => {
    setClasses(false);
    setReviews(true);
  };
  if (isLoading) return <FullPageLoader />;
  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        Geolocation.getCurrentPosition(
          (position) => {
            dispatch(setLocationState({ longitude: position?.coords?.longitude, latitude: position?.coords?.latitude }));
          },
          (error) => console.log("Error:", error.message),
          { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );
      }
    } catch (error: any) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    requestLocationPermission();
  }, []);

  return (
    <Container>
      {/*Header rect start*/}
      <View style={styles.mainHeaderRect}>
        <View style={{ position: "relative" }}>
          <Header hideBackButton lableStyle={{ marginTop: 40, marginBottom: 5 }} style={{ marginLeft: 5 }} label={"Home"} subLabel={"Hello: " + userMeData?.personal_info?.name} />
          <TouchableOpacity style={{ position: "absolute", top: 40, right: 10 }}>
            <Image
              style={{
                width: 80,
                height: 80,
                borderRadius: 200 / 2,
                overflow: "hidden",
                borderWidth: 1,
                borderColor: "grey",
              }}
              source={{ uri: userMeData?.personal_info?.profileImage }}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.secondHeaderRect}>
          <TouchableOpacity style={styles.mainclassesview} onPress={() => classestrueState()}>
            <Text style={[classes ? styles.titleText : styles.activeTitleText]}>Classes</Text>
            {classes ? <View style={styles.borderView}></View> : null}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => reviewstrueState()} style={styles.mainclassesview}>
            <Text style={[reviews ? styles.titleText : styles.activeTitleText]}>Reviews</Text>
            {reviews && <View style={styles.borderView}></View>}
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {classes && <Classes />}
        {reviews && <Reviews />}
      </ScrollView>
      <View style={styles.footerRect}>
        <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate("CreateBookSession")} style={styles.addIconRect}>
          <AntDesign name="plus" color={"#fff"} size={wp(6)} />
        </TouchableOpacity>
      </View>
    </Container>
  );
};

export default Home;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingTop: Platform.OS === "ios" ? 40 : 0,
  },
  mainHeaderRect: {
    width: "100%",
    height: 160,
  },
  topHeaderRect: {
    height: 100,
    width: "90%",
    alignSelf: "center",
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
  },
  homeTitleText: {
    fontSize: RFValue(22, 580),
    fontFamily: "Poppins-Bold",
    color: Colors.black,
    marginTop: 10,
  },
  userTitleText: {
    fontFamily: "Poppins-Regular",
    fontSize: RFValue(10, 580),
    color: "#000",
    textTransform: "capitalize",
  },
  profileImageRect: {
    width: "40%",
    alignItems: "flex-end",
    justifyContent: "center",
  },
  imagestyles: {
    width: 80,
    height: 80,
    borderRadius: 200 / 2,
  },
  secondHeaderRect: {
    height: 35,
    alignSelf: "center",
    flexDirection: "row",
    marginTop: 30,
    marginBottom: 20,
  },
  titleText: {
    fontSize: RFValue(12, 580),
    color: "#ff0000",
    fontFamily: "Poppins-Regular",
  },
  activeTitleText: {
    fontSize: RFValue(12, 580),
    color: "#000",
    fontFamily: "Poppins-Regular",
  },
  mainclassesview: {
    width: "50%",
    alignItems: "center",
  },
  mainBody: {
    width: "100%",
  },
  borderView: {
    width: 30,
    borderWidth: 1,
    borderColor: "#ff0000",
  },
  footerRect: {
    height: "16%",
    bottom: Platform.OS === "ios" ? 26 : 0,
    alignItems: "flex-end",
    paddingTop: 7,
  },
  addIconRect: {
    width: 56,
    height: 56,
    borderRadius: 40,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  seacherbariconview: {
    width: "12%",
    alignItems: "center",
    justifyContent: "center",
  },
});
