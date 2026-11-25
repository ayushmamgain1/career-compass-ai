import crypto from "crypto";

const hashOTP = (otp) => {
  return crypto
    .createHmac("sha256", process.env.OTP_SECRET)
    .update(otp)
    .digest("hex");
};

export default hashOTP;