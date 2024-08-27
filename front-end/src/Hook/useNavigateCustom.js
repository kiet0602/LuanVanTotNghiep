import { useNavigate } from "react-router-dom";

const useNavigateCustom = () => {
  const navigate = useNavigate();

  const goHome = () => navigate("/");
  const goRegister = () => navigate("/signUp");
  const goLogin = () => navigate("/signIn");

  return { goHome, goRegister, goLogin };
};

export default useNavigateCustom;
