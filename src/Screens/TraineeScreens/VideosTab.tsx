import { View, StyleSheet, ScrollView, Pressable, Alert, Image } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { RFValue } from "react-native-responsive-fontsize";
import VideoPlayer from "react-native-video-player";
import Button from "../../Components/Button";
import { useRoute } from "@react-navigation/native";
import Container from "../../Components/Container";
import Typography from "../../Components/typography/text";
import { useGetMyBookedVideosQuery, useGetTrainerVideosForTrainerDetailsQuery } from "../../slice/FitsApi.slice";
import { NavigationSwitchProp } from "react-navigation";
import Colors from "../../constants/Colors";
import { useSelector } from "react-redux";
import { UserDetail } from "../../interfaces";
import { useEffect } from "react";

interface PropsInterface {
  navigation: NavigationSwitchProp;
}

const VideosTab = ({ navigation }: PropsInterface) => {
  const { userInfo } = useSelector((state: { fitsStore: Partial<UserDetail> }) => state.fitsStore);
  const route = useRoute();
  const { data: trainerVideos, refetch: trainerVideosRefecth } = useGetTrainerVideosForTrainerDetailsQuery(route.params?.userData.user._id);
  const { data: myBookedVideos, refetch: refetchMyBookedVideos, } = useGetMyBookedVideosQuery(userInfo?.user?._id);

  const goToNextScreen = (video: any) => {
    if (!userInfo?.user?.cus_id) navigation.navigate("CreateCardScreen");
    else navigation.navigate("SubscribeVideoPayment", { trainerData: route.params, video });
  };

  const handleCheckIsSubscribed = (videoId: string) => {
    return myBookedVideos?.some((item: any) => item?._id === videoId);
  };

  useEffect(() => {
    const focusListener = navigation.addListener('focus', () => {
      trainerVideosRefecth();
      refetchMyBookedVideos();
    });
  
    return () => {
      focusListener.remove();
    };
  }, [navigation, trainerVideosRefecth, refetchMyBookedVideos]);


  console.log(JSON.stringify(myBookedVideos));
  
  return (
    <Container>
      <View style={styles.topView}>
        <Typography size={"heading3"} weight="600">
          Recently Added
        </Typography>
      </View>
      <View style={styles.main}>
        <ScrollView showsHorizontalScrollIndicator={false} horizontal>
          {trainerVideos?.data.map((video) => {
            const isAlreadySubscribed = handleCheckIsSubscribed(video._id);
            return (
              <View style={styles.boxView} key={video._id}>
                <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", margin: 7 }}>
                  <View style={styles.badgeWraper}>
                    <FontAwesome name="star" color={Colors.black} size={12} />
                    <Typography>{" " + video.averageRating}</Typography>
                  </View>
                  <View style={[styles.badgeWraper, { backgroundColor: Colors.darkBack }]}>
                    <Typography color="white" size={"heading3"}>{`$ ${video.price}`}</Typography>
                    <Typography color="white" size={"heading3"}>
                      {video.numReviews}
                    </Typography>
                  </View>
                </View>
                {isAlreadySubscribed ? (
                  <VideoPlayer
                    video={{
                      uri: video.video_links,
                    }}
                    filterEnabled={true}
                    videoWidth={900}
                    videoHeight={500}
                    thumbnail={{
                      uri: video.video_thumbnail,
                    }}
                  />
                ) : (
                  <View style={{ position: "relative", justifyContent: "center", alignItems: "center", width: 300, height: 200 }}>
                    <Image
                      style={{
                        width: 400,
                        height: 200,
                        overflow: "hidden",
                        position: "absolute",
                      }}
                      source={{
                        uri: video.video_thumbnail,
                      }}
                      resizeMode="cover"
                    />
                    <Typography size={"caption"} style={{ padding: 10, borderRadius: 10, zIndex: 999, backgroundColor: Colors.transparentBlack }} color="white" children={"Subscribe for play"} />
                  </View>
                )}

                <View style={{ padding: 15, rowGap: 5 }}>
                  <Typography size={"heading2"} weight="600" color="white">
                    Description
                  </Typography>
                  <Typography size={"medium"} weight="600" color="white90">
                    {video.video_details}
                  </Typography>
                </View>
                <Button style={{ alignSelf: "center", marginVertical: 10 }} variant="tini" label={isAlreadySubscribed ? "Subscribed" : "Book Now"} disabled={isAlreadySubscribed}  onPress={() => goToNextScreen(video)} />
              </View>
            );
          })}
        </ScrollView>
      </View>
    </Container>
  );
};
export default VideosTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    width: "100%",
    height: 120,
  },
  fixeheight: {
    height: 50,
    justifyContent: "center",
    borderBottomWidth: 0.5,
    borderColor: "lightgrey",
    width: "100%",
    alignItems: "center",
  },
  fixeheight1: {
    height: 70,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  main: {
    width: "100%",
    marginBottom: 20,
  },
  footer: {
    width: "100%",
    marginBottom: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
  },
  TopView: {
    width: "100%",
    alignItems: "center",
  },
  topView: { width: "90%" },
  topView1: {
    width: "90%",
    alignItems: "center",
  },
  VideoboughtText: {
    fontFamily: "Poppins-SemiBold",
    fontSize: RFValue(15, 580),
    color: "#000",
    marginTop: 10,
  },
  rowView: {
    width: "100%",
    flexDirection: "row",
    alignItems: "baseline",
  },
  desTextStyles: {
    color: "#ffffff",
    fontSize: RFValue(12, 580),
    fontFamily: "Poppins-Regular",
  },
  destTextStyles: {
    color: "#ffffff",
    fontSize: RFValue(12, 580),
    fontFamily: "Poppins-Regular",
    marginBottom: 10,
  },
  lockbtn: {
    position: "absolute",
    top: 30,
    left: 125,
  },
  ratingWrap: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: "black",
    paddingLeft: 15,
    paddingRight: 15,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeWraper: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    paddingVertical: 2,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  boxView: {
    width: 320,
    backgroundColor: "#000",
    margin: 9,
    borderRadius: 12,
    overflow: "hidden",
  },
});
