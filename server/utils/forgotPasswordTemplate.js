
const forgotPasswordTemplate = ({name, otp}) => {
    return `
<div>
    <p>Dear ${name}, </p>
    <p>You're requested a password reset. Please use following OTP code to reset your password. </p>

    <div style = "background : yellow; font-size : 20px; padding : 20px; text-align : center ">
        ${otp}
    </div>

    <p>This otp is valid for 1hour only. </p>
    </br>
    </br>
    <p>ThankYou</p>
    <p>Blinkit</p>


</div>
    `
}

export default forgotPasswordTemplate