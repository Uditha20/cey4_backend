import jwt from "jsonwebtoken";

const generateToken = (id, role,res) => {
  const token = jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
  res.cookie("token", token, {
		httpOnly: true,
		sameSite: "strict",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
		maxAge: 7 * 24 * 60 * 60 * 1000,
	});

	return token;
};

export default generateToken;
