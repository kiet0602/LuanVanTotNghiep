import jwt from "jsonwebtoken";

const Auth = async (req, res, next) => {
  try {
    //access authentication header to validate request
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).json({ error: "authentication Failed" });
  }
};
export default Auth;

export function localVariables(req, res, next) {
  req.app.locals = {
    OTP: null,
    resetSession: false,
  };
  next();
}
