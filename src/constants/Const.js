export const baseURL = "https://wine.betademo.net/testing/mobile/";
// export const baseURL = "https://wine.betademo.net/backend/mobile/";
//export const baseURL = 'http://10.0.0.5:3002/mobile/'

//https://wine.betademo.net/backend/mobile/
//Api's
export const loginApi = "user/login";
export const registerApi = "user/signUp";
export const verifyOTPApi = "user/verifyOTP";
export const userchangeMobileOTPVerify = "user/changeMobileOTPVerify";
//export const getCustomerOrder="order/customerList";
export const getCustomerOrder = "order/customerListNew";
export const getUserNotification = "user/notification/list";
export const getNotificationList = "notification/list";
export const myOrder = "order/myListNew";
export const viewOrderDetail = "order/details";
export const productscan = "product/scan";

export const UserAddProduct = "product/create";
export const categoryDetail = "category/details";
export const countryDetail = "countries/details";
export const getUserProduct = "product/details";
export const userProductList = "product/list";
export const userProductDetails = "product/details";
export const removeFavouriteItem = "favourite/remove";
export const UserCartList = "cart/list";
export const decreseCartItem = "cart/decrease";
export const IncreseCartItem = "cart/increase";
export const removeCartItem = "cart/removeItem";
export const searchMarketWine = "market/wineSearch";
export const WineDetails = "market/wineDetails";
export const AddtoCart = "cart/add";
export const getFavoriteList = "favourite/details";
export const marketWineList = "market/wineList";
export const addFavouriteProduct = "favourite/add";
export const getUserAddress = "user/getAddresses";
export const getUserUpdateAddress = "user/updateAddress";
export const removeAddress = "user/removeAddress";
export const ProductSellToMarket = "product/sellToMarket";
export const ProductMoveFromMarket = "product/moveFromMarket";
export const ChangeNumberVerify = "user/changeMobileOTPVerify";
export const forgotPasswordApi = "user/forgotPassword";
export const resetMobileNumberApi = "user/resetMobileNumber";
export const resetPasswordApi = "user/resetPassword";
export const resendOTPApi = "user/resendOtp";
export const getUserDetail = "user/getDetails";
export const changePasswordAPI = "user/changePassword";

export const setAddressApi = "user/addAddress";
export const setBankAPI = "user/createBankInfo";
export const changeMobileNumber = "user/changeMobileNumber";
export const editProfile = "user/editUser";

export const dashboardCountApi = "users/get-count-stats";
export const dashboardDataAPI = "users/get-user-works-summary";
export const workpostApi = "works/post";
export const exploreWorkAPI = "works/explore-works";
export const exploreAllWorkAPI = "users/get-all-works";
export const getUserProfileAPI = "users/view-my-profile";
export const updateUserProfile = "users/update-profile";
export const workDetailAPI = "works/view";
export const getAllComments = "works/view-all-comments";
export const postCommentApi = "works/post-comment";
export const favoriteApi = "works/update-favourite-status";
export const likeApi = "works/update-like-status";
export const getChapterIndexAPI = "works/chapters/index";
export const addChapterAPI = "works/chapters/store";
export const getPublishedWork = "works/view-published-works";
export const getFavouriteWork = "users/view-user-profile";
export const getMyWork = "users/paginate-profile-works";
export const markchapterReadAPI = "works/chapters/update-chapter-read-status";
export const getChapterDetails = "works/chapters/view";
export const markasReadAPI = "works/update-read-status";
export const followUserApi = "users/follow";
export const getFollowersData = "users/get-paginate-user-followers";
export const getSavedData = "works/view-saved-works";
export const removeSavedWork = "works/remove-saved-work";
export const notificationApi = "users/notifications";
export const markAsViewed = "works/mark-as-viewed";
export const clearNotifications = "users/clear-all-notifications";
export const cartcount = "/cart/count";

export const NotificationSwitchAPI = "users/update-notification-status";
export const logoutAPI = "users/logout";

export const categorydetail = "category/details";
export const productmoveFromMarket = "product/moveFromMarket";
export const cartcheckout = "cart/checkout";
export const promocodeapply = "promocode/apply";
export const finalCheckout = "final/checkout";
export const logout = "user/logout";
export const NotificationStatus = "user/notification";
export const OrderCancel = "order/cancel";
export const orderPickupDate = "order/pickupDetails";
export const removeimage = "product/imageRemove";
export const EditWine = "product/update/details";
export const addImage = "product/addImage";

//Static Pages URL

export const termsConditions =
  "https://grrn.testingdemo.net/pages/terms-conditions";
export const contactUS = "https://grrn.testingdemo.net/pages/contact-us";
export const aboutUs = "https://grrn.testingdemo.net/pages/about-us";

export const faq = "https://wine.betademo.net/faq";
export const policies = "https://wine.betademo.net/privacyPolicy";
export const howWork = "https://wine.betademo.net/howItWork";

//Static Pages Title
export const aboutUsTitle = "About us";
export const policiesTitle = "Privacy Policy";
export const faqTitle = "FAQ";
export const contactusTitle = "Contact us";
export const howItWorks = "How It Works";
export const termsConditionTitle = "Terms & Conditions";

//Messages
export const noInternet = "Please Connect To Internet.";
export const PhoneNumberRequired = "Phone number is Required.";
export const validateMobileRequired =
  "Phone number should be min 10 characters long.";

export const passwordRequired = "Password is Required.";
export const validPasswordRequired =
  "Password should be min 6 characters long.";
export const fullNameRequired = "Full Name is Required.";
export const countryNameRequired = "Country is Required.";
export const emailAddressRequired = "Email Address is Required.";
export const confirmPasswordRequired = "Confirm Password is Required.";
export const passwordNotMatch = "Password & Confirm Password does not match.";
export const agreeTerms = "Please Agree To Terms & Conditions.";
export const otpRequired =
  "Please enter 4 digit otp received on your Mobile Number.";
export const validEmailRequired = "Please enter a valid Email Address";
export const validUserNameRequired =
  "User Name should be min 5 characters long.";
export const workTitleRequired = "Work Title is Required.";
export const workSummaryRequired = "Work Summary is Required.";
export const relationShipRequired = "Select at-least 1 relationship type.";
export const languageRequired = "Please select language.";
export const coverImageRequired = "Cover Image is Required.";
export const serverError = "Server Error. Please try again later.";
export const otherTextTypeRequired = "Please specify other work type.";
export const nameRequired = "Name is Required.";
export const emailRequired = "Email Address is Required.";
export const oldpasswordRequired = "Old Password is Required.";
export const newPasswordRequired = "New Password is Required.";
export const validoldPasswordRequired =
  "Old Password should be min 6 characters long.";
export const validnewPasswordRequired =
  "New Password should be min 6 characters long.";
export const validconfirmPasswordRequired =
  "Confirm Password should be min 6 characters long.";
export const validpasswordNotMatch =
  "New Password & Confirm Password does not match.";
export const validationChapterNumber = "Chapter Number is Required";
export const validationChapterTitle = "Chapter Title is Required";
export const validationChapterContent = "Chapter Content is Required";
export const dobRequired = "Please select your Date of Birth.";
export const profileImageRequired = "Please select your Profile Image.";
