const verifyEmailTemplate = ({name, url}) => {
    return `
      <p>Dear ${name}</p>
      <p>Thank you for registering Blinkit.</p>

    <a href=${url} style="color : light-blue; background : white; margin-top : 10px; padding: 20px  ">
        Verify Email
    </a>

    `
}

export default verifyEmailTemplate;