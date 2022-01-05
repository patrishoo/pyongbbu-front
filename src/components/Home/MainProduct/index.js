import React, { useEffect, useState } from "react";
import {
  ComponentsContainer,
  MPContainer,
  ImageMain,
  Words1,
  ButtonShop,
  imgdiv,
  CuteImg,
} from "./MainProductComponents";
import MainImage from "../../../images/testImage.png";
import "./wave.css";
import dino from '../../../images/DinoBalloon.png'

const MainProduct = () => {
  const [offsetY, setOffsetY] = useState(0);
  const handleScroll = () => setOffsetY(window.pageYOffset);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <MPContainer>
        <ImageMain src={MainImage} />
        <ComponentsContainer>
          <Words1>Walk with Style while wearing our Tote Bags!</Words1>
          <ButtonShop>Shop Now!</ButtonShop>
          <imgdiv>
            <CuteImg
              src={dino}
              style={{ transform: `translateY(-${offsetY * 0.1}px)` }}
            />
          </imgdiv>
        </ComponentsContainer>
        <div className="custom-shape-divider-bottom-1638502151">
          <svg
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              className="shape-fill"
            ></path>
          </svg>
        </div>
      </MPContainer>
    </>
  );
};

export default MainProduct;
