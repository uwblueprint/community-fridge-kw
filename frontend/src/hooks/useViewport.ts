import { useMediaQuery } from "@chakra-ui/react";
import React from "react";

type ViewportType = {
  isMobile: boolean;
  isDesktop: boolean;
};

function useViewport(): ViewportType {
  const [isMobile, isDesktop] = useMediaQuery([
    "(max-width: 768px)",
    "(min-width: 768px)",
  ]);
  return {
    isMobile,
    isDesktop,
  };
}

export default useViewport;
