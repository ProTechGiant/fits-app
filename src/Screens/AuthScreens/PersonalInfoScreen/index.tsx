import React, { useState } from "react";
import {  Text,  View,  Pressable,  Modal,  Image,  ScrollView,  ToastAndroid,  TouchableOpacity,  StyleSheet, Platform,} from "react-native";
import ImagePicker from "react-native-image-crop-picker";
import moment from "moment";
import Entypo from "react-native-vector-icons/Entypo";
import DatePicker from "react-native-date-picker";
import * as Yup from 'yup'
import * as Images from "../../../constants/Images";
import Header from "../../../Components/Header";
import Colors from "../../../constants/Colors";
import Button from "../../../Components/Button";
import CountryPicker from "react-native-country-picker-modal";
import { useNavigation } from "@react-navigation/native";
import TextInput from "../../../Components/Input";
import Container from "../../../Components/Container";
import { RFValue } from "react-native-responsive-fontsize";
import Typography from "../../../Components/typography/text";
import { useSelector } from "react-redux";
import { UserDetailInfoInterface } from "../../../interfaces";
import { usePersonalInfoUpdateMutation } from "../../../slice/FitsApi.slice";
import { PersonalInfoFormValidationResultInterface, PersonalInfoValidateErrorsIntarface, PersonalInfoValidateSchemaInterface } from "../types";
import { validateForm } from "../../../utils/validation";
import { errorToast } from "../../../utils/toast";

export const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  date_of_birth: Yup.date().required('Date of birth is required'),
  country: Yup.string().required('Country is required'),
  phoneNumber: Yup.string().required('Phone number is required'),
  state: Yup.string().required('State is required'),
  city: Yup.string().required('City is required'),
  gender: Yup.string().required('Gender is required'),
  profileImage: Yup.string(),
  confirmPassword: Yup.string().oneOf([Yup.ref('password')], 'Passwords must match'),
});



const PersonalInfo = () => {
  const token: string = useSelector((state: { token: string }) => state.token);
  const { user } = useSelector((state: {fitsStore: UserDetailInfoInterface}) => state.fitsStore);
  // Hooks
  const navigation = useNavigation()
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleDate, setModalVisibleDate] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [date, setDate] = useState(new Date());
  const [country, setCountry] = useState("");
  const [validationErrors, setValidationErrors] = useState<PersonalInfoValidateErrorsIntarface>({});
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [gender, setGender] = useState("");
  const [statusOne, setStatusOne] = useState(false);
  const [statusTwo, setStatusTwo] = useState(false);
  const [statusThree, setStatusThree] = useState(false);
  const [image, setImage] = useState("");
  const [cloudImageUrl, setCloudImageUrl] = useState("");
  const [isCountryVisible, setIsCountryVisible] = React.useState(false);
  const [mutateAsyncPersonalInfoUpdate, { isLoading }] = usePersonalInfoUpdateMutation()

  // Functions
  const onPressFlag = () => {
    return setIsCountryVisible(true);
  };

  const TrainerFlow = async () => {
    navigation.navigate("ProfessionalInfo");
  };

  const TraineeFlow = async () => {
    navigation.navigate("FitnessLevel");
  };

  const personalInfoCall = async () => {

    const formValues: PersonalInfoValidateSchemaInterface = {
      name: fullName,
      date_of_birth: date,
      country: country,
      phoneNumber: phoneNumber,
      state: state,
      city: city,
      gender: gender,
      profileImage: cloudImageUrl,
    };

    const { isValid, errors }: PersonalInfoFormValidationResultInterface = await validateForm(formValues, validationSchema);
    setValidationErrors(errors);
    if (isValid) {
      const result = await mutateAsyncPersonalInfoUpdate(formValues)
      if (result?.error) errorToast(result?.error?.data?.message) 
    }
  };

  const choosePhotoFromCamera = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
      compressImageQuality: 0.4,
    })
      .then((file) => {
        if (file) {
          let newFile = {
            uri: file.path,
            type: "image/png",
            name: `image.png`,
          };
          uploadImageOnCloud(newFile);
          setImage(file.path);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const uploadImageOnCloud = async (image) => {
    const zzz = new FormData();
    zzz.append("file", image);
    zzz.append("upload_preset", "employeeApp");
    zzz.append("cloud_name", "ZACodders");
    await fetch("https://api.cloudinary.com/v1_1/ZACodders/image/upload", {
      method: "POST",
      body: zzz,
    })
      .then((res) => res.json())
      .then((res2) => {
        setCloudImageUrl(res2?.url);
      })
      .catch((error) => {
        ToastAndroid.show(error, ToastAndroid.LONG);
      });
  };

  // Effects
/*   useEffect(() => {
  }, [getUserInfo]); */

  return (
    <Container>
      <View style={{position: 'relative'}}>
        <Header label={"Peronal Info"} subLabel={"Fill in your details "}/>
        <TouchableOpacity
          style={{position: 'absolute', top: 70, right: 10}}
          onPress={choosePhotoFromCamera}>
          {image === "" ? (
            <Image
            style={{
              width: 80,
              height: 80,
              borderRadius: 200 / 2,
              overflow: "hidden",
              borderWidth: 1,
              borderColor: "grey",
            }}
            source={Images.Profile}
            />
            ) : (
              <Image
              style={styles.imagestyle}
              source={{
                uri: image,
              }}
              />
              )}
        </TouchableOpacity>
      </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                  <TextInput
                    error={validationErrors.name}
                    placeholder="Enter Name"
                    label="Full Name"
                    value={fullName}
                    onChangeText={setFullName}
                  />
                  <TextInput
                    error={validationErrors.date_of_birth}
                    handleOnPress={() => setModalVisibleDate(true)}
                    placeholder="Select Date of Birth"
                    isEditable={false}
                    value={moment(date).format("DD-MM-YYYY")} label={"Date of birth"}
                  />
                    <TextInput
                    error={validationErrors.country}
                    label="Country"
                    placeholder="Select Your Country"
                    value={country}
                      isEditable={false}
                      handleOnPress={onPressFlag}
                    onChangeText={setCountry}
                  />
                    <TextInput
                      label="Phone Number"
                    error={validationErrors.phoneNumber}
                    keyboard={"numeric"}
                    placeholder="Enter your Number"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                  />
                  <TextInput
                    error={validationErrors.state}
                    placeholder="Enter Your State"
                    value={state}
                    onChangeText={setState}
                    label={"State"} />
                  <TextInput
                    error={validationErrors.city}
                    placeholder="Enter Your City"
                    value={city}
                    onChangeText={setCity} label={"City"}
                  />
                <TouchableOpacity
                  onPress={() => setModalVisible(true)}
                  activeOpacity={0.8}
                  style={styles.inputMainView}
                >
              <View style={styles.genderTopview}>
                <View
                  style={{
                    width: "50%",
                    justifyContent: "center",
                  }}
                >
                  <Text style={styles.genderText}>Gender</Text>
                </View>
                <View
                  style={{
                    width: "40%",
                    borderColor: "#fff",
                    alignItems: "flex-end",
                    justifyContent: "center",
                  }}
                >
                  <Typography color="white" size="heading5">{gender}</Typography>
                </View>
                <View style={styles.iconView}>
                  <Entypo
                    name="chevron-down"
                    style={{
                      fontSize: 20,
                      color: Colors.white,
                    }}
                  />
                </View>
              </View>
                </TouchableOpacity>
              </ScrollView>
          {isCountryVisible && (
            <CountryPicker
              onClose={() => setIsCountryVisible(false)}
              visible={isCountryVisible}
            onSelect={(value) => setCountry(value.name)} countryCode={"AF"} />
          )}

          {/*Modal Start*/}
          <View style={styles.centeredView}>
            <Modal
              animationType="fade"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => setModalVisible(false)}
            >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <ScrollView showsVerticalScrollIndicator={false}>
                    <View
                      style={{
                        width: "100%",
                        alignItems: "flex-start",
                      }}
                    >
                      <View
                        style={{
                          width: "90%",
                          alignSelf: "center",
                          height: 60,
                          justifyContent: "center",
                        }}
                      >
                        <Typography size={'heading1'}>
                          Gender
                      <Typography size='medium'>{"  "}(Select one)</Typography>
                        </Typography>
                      </View>

                      <View style={styles.opercard}>
                        <Pressable
                          style={styles.box}
                          onPress={() => {
                            setGender("Male");
                            setModalVisible(false);
                            setStatusOne(true);
                            setStatusTwo(false);
                            setStatusThree(false);
                          }}
                        >
                          <View
                            style={[
                              statusOne ? styles.BoxViewBoder : styles.inner,
                            ]}
                          >
                            <Image source={Images.Vector} />
                            <Text style={styles.maletext}>Male</Text>
                          </View>
                        </Pressable>

                        <Pressable
                          style={styles.box1}
                          onPress={() => {
                            setGender("Female");
                            setModalVisible(false);
                            setStatusOne(false);
                            setStatusTwo(true);
                            setStatusThree(false);
                          }}
                        >
                          <View
                            style={[
                              statusTwo ? styles.BoxViewBoder : styles.inner,
                            ]}
                          >
                            <Image source={Images.Vector2} />
                            <Text style={styles.maletext}>Female</Text>
                          </View>
                        </Pressable>
                      </View>
                      <View
                        style={{
                          width: "100%",
                          height: "30%",
                          marginTop: 8,
                        }}
                      >
                        <Pressable
                          style={styles.otherView}
                          onPress={() => {
                            setGender("Other");
                            setModalVisible(false);
                            setStatusOne(false);
                            setStatusTwo(false);
                            setStatusThree(true);
                          }}
                        >
                          <View
                            style={[
                              statusThree
                                ? styles.oternameviewBorder
                                : styles.oternameview,
                            ]}
                          >
                            <Text style={styles.otherText}>Other</Text>
                          </View>
                        </Pressable>
                      </View>
                    </View>
                  </ScrollView>
                </View>
              </View>
            </Modal>
          </View>
          {/* Modal End*/}

          {/*modalVisibleDate Start*/}
          <View style={styles.centeredView}>
            <Modal
              animationType="fade"
              transparent={true}
              visible={modalVisibleDate}
              onRequestClose={() => {
                setModalVisibleDate(false);
              }}
            >
              <View style={styles.centeredView}>
                <View style={styles.modalViewdate}>
                  <ScrollView showsVerticalScrollIndicator={false}>
                    <View
                      style={{
                        width: "100%",
                        alignItems: "flex-start",
                      }}
                    >
                      <View style={styles.cancelView}>
                        <Pressable
                          onPress={() => setModalVisibleDate(false)}
                          style={styles.canceldoneView}
                        >
                          <Text style={styles.TextCancelDone}>Cancel</Text>
                        </Pressable>
                        <View style={styles.DOBView}>
                          <Text style={styles.TextDOB}>Date of Birth</Text>
                        </View>
                        <Pressable
                          onPress={() => setModalVisibleDate(false)}
                          style={styles.canceldoneView}
                        >
                          <Text style={styles.TextCancelDone}>Done</Text>
                        </Pressable>
                      </View>

                      <View style={styles.topView}>
                        <DatePicker
                          mode="date"
                          textColor="#000"
                          date={date}
                          style={styles.DatePicker}
                          onDateChange={setDate}
                        />
                      </View>
                    </View>
                  </ScrollView>
                </View>
              </View>
            </Modal>
          </View>
          {/* modalVisibleDate End*/}
        <Button
          loader={isLoading}
          label={"NEXT"}
          disabled={isLoading}
          onPress={personalInfoCall}
        />
    </Container>
  );
};

export default PersonalInfo;


const styles = StyleSheet.create({
  topView: { width: "90%", alignItems: "center", alignSelf: "center" },

  DatePicker: {
    height: 250,
  },
  opercard: {
    width: "88%",
    alignSelf: "center",
    flexDirection: "row",
  },
  box: {
    width: "50%",
    alignItems: "flex-start",
  },
  BoxViewBoder: {
    backgroundColor: Colors.black,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    margin: 10,
    height: 130,
    width: 130,
    borderRadius: 25,
    flexDirection: "column",
    borderColor: "#ff0000",
  },
  box1: {
    width: "50%",
    alignItems: "flex-end",
  },
  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    opacity: 1,
  },
  modalView: {
    margin: 0,
    width: "100%",
    height: "42%",
    backgroundColor: Colors.white,
    borderRadius: 7,
    padding: 0,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 6.84,
    elevation: 7,
    borderWidth: 1,
    borderColor: "lightgrey",
  },
  modalViewdate: {
    margin: 0,
    width: "100%",
    height: "38%",
    backgroundColor: Colors.white,
    borderRadius: 7,
    padding: 0,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 6.84,
    elevation: 5,
  },
  cancelView: {
    width: "90%",
    flexDirection: "row",
    alignSelf: "center",
    marginTop: 10,
  },

  TextDOB: {
    fontSize: RFValue(18, 580),
    fontFamily: "Poppins-SemiBold",
    color: Colors.black,
  },
  TextCancelDone: {
    fontFamily: "poppins-Regular",
    color: Colors.black,
    fontSize: RFValue(12, 580),
  },

  inner: {
    backgroundColor: Colors.black,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    margin: 10,
    height: 130,
    width: 130,
    borderRadius: 25,
    flexDirection: "column",
  },

  imagestyle: {
    width: 80,
    height: 80,
    borderRadius: 200 / 2,
  },
  genderTopview: {
    width: "100%",
    backgroundColor: Colors.black,
    borderRadius: 10,
    height: 60,
    flexDirection: "row",
  },
  genderText: {
    fontSize: RFValue(13, 580),
    fontFamily: "poppins-regular",
    color: Colors.white,
    left: 10,
  },
  iconView: {
    width: "10%",
    borderColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  maletext: {
    color: Colors.white,
    fontWeight: "bold",
    fontSize: RFValue(9, 580),
    fontFamily: "poppins-regular",
  },
  oternameview: {
    padding: 15,
    borderRadius: 14,
    width: "80%",
    backgroundColor: Colors.black,
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
  },
  oternameviewBorder: {
    padding: 15,
    borderRadius: 14,
    width: "80%",
    backgroundColor: Colors.black,
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
    borderWidth: 2,
    borderColor: "#ff0000",
  },
  otherText: {
    color: Colors.white,
    fontSize: RFValue(16, 580),
    fontFamily: "poppins-regular",
  },
  otherView: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  canceldoneView: {
    width: "20%",
    alignItems: "center",
    justifyContent: "center",
  },
  DOBView: {
    width: "60%",
    alignItems: "center",
    justifyContent: "center",
  },
  inputMainView: {
    backgroundColor: Colors.black,
    borderRadius: 8,
    marginTop: "3%",
    marginBottom: "3%",
    justifyContent: "center",
    alignSelf: "center",
    height: Platform.OS === "ios" ? 60 : 60,
  },
});






