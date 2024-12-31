export default function handler(req, res) {
  const today = new Date();
  const formattedDate = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;
  res.status(200).json({ currentDate: formattedDate });
}