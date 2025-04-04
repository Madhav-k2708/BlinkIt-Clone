import Axios from "./Axios";
import summaryApi from "../common/summaryApi";
import AxiosToastError from "./AxiosToastError";

const fetchUserDetails = async () => {
  try {
    const response = await Axios({
      ...summaryApi.user_details,
    });
    return response.data;
  } catch (error) {
    console.log(error.message)

  }
};

export default fetchUserDetails;
