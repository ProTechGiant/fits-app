import { ReactNode } from "react";
import { UserMeApiResponse } from "../slice/store.interface";

/* eslint-disable prettier/prettier */
export interface SelectStatusesUserDataInterfaceInterface {
  id: number;
  content: string;
  title: string;
}

export interface UserDetailInfoInterface {
  access_token: string;
  user: UserDataInterface;
  login: boolean;
  message: string;
  profile_completed: boolean;
  profile_status?: ProfileStatus;
}

export interface UserDataInterface {
  user: any;
  image: any;
  price: ReactNode;
  class_title: ReactNode;
  session_type: any;
  _id: string;
  accountVerified: string;
  amount: number;
  averageRating: number;
  cardCreated: boolean;
  createdAt: string;
  cus_id: string;
  email: string;
  emailVerified: boolean;
  isVerified: boolean;
  numReviews: number;
  password: string;
  personal: string;
  profession: string;
  reset_password: boolean;
  role: string;
  services_offered: ServicesOffered;
  suspended: boolean;
  trainerVerified: string;
}

export interface ServicesOffered {
  key: string;
  value: string;
}

export interface ProfileStatus {
  step_1: boolean;
  step_2: boolean;
  step_3: boolean;
}

export interface MyRequestHeaders {
  'Content-Type': string;
  Authorization?: string;
  // Additional headers...
}

export interface UserInterface {
  _id: string
  accountVerified: string
  amount: number
  averageRating: number
  cardCreated: boolean
  createdAt: string
  cus_id: string
  email: string
  emailVerified: boolean
  isVerified: boolean
  numReviews: number
  password: string
  personal: string
  profession: string
  reset_password: boolean
  role: string
  services_offered: ServicesOffered
  suspended: boolean
  trainerVerified: string
}

export interface UserDetail {
  userInfo: UserMeApiResponse
}

export interface TrainerSessionApiResultInterface {
  statusCode: number;
  success: boolean;
  message: string;
  data: Data;
}

interface Data {
  classes: TrainerClassInterfaceInTraineeScreenInterface[];
  personal_info: TrainerPersonalinfoInTraineeScreenInterface[];
  profession_info: TrainerProfessioninfoInTraineeScreen[];
}

export interface TrainerProfessioninfoInTraineeScreen {
  verification_status: string;
  _id: string;
  experience_year: number;
  experience_note: string;
  qualification: Qualification[];
  user: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Qualification {
  _id: string;
  id: number;
  degree: string;
  degree_note: string;
}

export interface TrainerPersonalinfoInTraineeScreenInterface {
  _id: string;
  name: string;
  date_of_birth: string;
  country: string;
  state: string;
  city: string;
  gender: string;
  user: string; // ˚˚˚˚˚˚˚˚˚˚˚˚˚˚˚˚˚˚˚˚˚˚˚˚˚˚
  profileImage: string;
  phoneNumber: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface TrainerClassInterfaceInTraineeScreenInterface {
  image: string;
  numReviews: number;
  averageRating: number;
  _id: string;
  session_title: string;
  class_title: string;
  select_date: string;
  class_time: string;
  duration: number;
  equipment: Equipment[];
  session_type: Sessiontype;
  sports: string;
  details: string;
  price: number;
  no_of_slots: number;
  user?: User;
  createdAt: string;
}

interface User {
  services_offered: Servicesoffered;
  role: string;
  isVerified: boolean;
  amount: number;
  emailVerified: boolean;
  suspended: boolean;
  reset_password: boolean;
  trainerVerified: string;
  accountVerified: string;
  numReviews: number;
  averageRating: number;
  cardCreated: boolean;
  _id: string;
  email: string;
  password: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  personal: string;
  profession: string;
}

interface Servicesoffered {
  value: string;
  key: string;
}

interface Sessiontype {
  _id: string;
  type: string;
  lat?: number;
  lng?: number;
  meetingLink?: string;
  recordCategory: string;
  no_of_play: string;
  videoTitle: string;
  videoLink?: string;
  desc?: string;
}

interface Equipment {
  _id: string;
  value: string;
}

export interface MessageInterface {
  status: false,
  _id: string,
  roomId: string,
  userId: string,
  message: string,
  createdAt: string,
  updatedAt: string,
}

export interface RoomMessagesResponse {
  data: {
    messages: MessageInterface[];
  };
  statusCode: number;
  message: string;
  success: boolean;
}
export interface TrainerVideosForTrainerDetailsApiResponse {
  statusCode: number
  data: VideosData[]
  success: boolean
}

export interface VideosData {
  video_links: string
  numReviews: number
  averageRating: number
  video_thumbnail: string
  _id: string
  topic: string
  video_category: string
  video_details: string
  price: number
  user: string
  createdAt: string
  updatedAt: string
  __v: number
}


export interface StripeCustomerInterface {
  address: any
  balance: number
  created: number
  currency: string
  default_currency: string
  default_source: string
  delinquent: boolean
  description: any
  discount: any
  email: string
  id: string
  invoice_prefix: string
  invoice_settings: InvoiceSettings
  livemode: boolean
  name: string
  next_invoice_sequence: number
  object: string
  phone: string
  preferred_locales: any[]
  shipping: any
  tax_exempt: string
  test_clock: any
}

export interface InvoiceSettings {
  custom_fields: any
  default_payment_method: any
  footer: any
  rendering_options: any
}
