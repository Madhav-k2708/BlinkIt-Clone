import summaryApi from "../common/summaryApi"
import Axios from "./Axios"

const uploadImage = async(image) => {
    try {
        const formData = new FormData()
        formData.append('image', image)

        const response = await Axios({
            ...summaryApi.uploadImage,
            data : formData
        })
        return response
    } catch (error) {
        return error
    }

}

export default uploadImage