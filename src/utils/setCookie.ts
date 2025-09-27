export default function setCookie(res: any, token: string) {
  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    partitioned: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
}
