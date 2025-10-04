import { useTranslation } from "react-i18next";

export const useDir = () => {
  const { i18n } = useTranslation();
  return i18n.dir();
};
