"use client";

import { useEffect } from "react";
import { Crisp } from "crisp-sdk-web";

export const CrispChat = () => {
  useEffect(() => {
    Crisp.configure("cbf06d18-89ca-4881-bc33-1dacefbcf85b");
  }, []);

  return null;
};
