import FarmBG from "../../assets/farm_bg.png";
import ModalBG from "../../assets/egg-modal.svg";
import CloseIcon from "../../assets/close.svg";
import EggImg from "../../assets/egg1.png";
import TapIcon from "../../assets/tap.svg";
import Egg from "./egg";
import { createElement, useEffect, useState } from "react";
import { useRadixian } from "../../context/radix";
import { fetchEggCount } from "../../api/egg";

const EGGS = [
  {
    left: "14%",
    bottom: "2%",
  },
  {
    left: "28%",
    bottom: "9%",
  },
  {
    left: "45%",
    bottom: "13%",
  },
  {
    left: "60%",
    bottom: "11%",
  },
  {
    left: "77%",
    bottom: "11%",
  },
  {
    left: "28%",
    bottom: "-4%",
  },
  {
    left: "45%",
    bottom: "-2%",
  },
  {
    left: "67%",
    bottom: "2%",
  },
  {
    left: "82%",
    bottom: "0%",
  },
]

export default function Farm() {
  const [isOpen, setIsOpen] = useState(false);
  const { dAppToolkit } = useRadixian();
  const [count, setCount] = useState<number>(1000);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const buyEgg = () => {
    if (!dAppToolkit) return;
    const wallet = dAppToolkit.walletApi.getWalletData()?.accounts[0]['address'];
    if (!wallet) return
    dAppToolkit.walletApi.sendTransaction({
      transactionManifest: `
        CALL_METHOD
          Address("${wallet}")
          "withdraw"
          Address("resource_tdx_2_1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxtfd2jc")
          Decimal("300")
        ;
        TAKE_ALL_FROM_WORKTOP
          Address("resource_tdx_2_1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxtfd2jc")
          Bucket("xrd_bucket")
        ;
        CALL_METHOD
          Address("component_tdx_2_1cpyr294csm672ekfcyu6u9fjn8stjcma6snjpz2wdn0eef72psah9x")
          "buy_egg"
          Bucket("xrd_bucket")
        ;
        CALL_METHOD
          Address("${wallet}")
          "deposit_batch"
          Expression("ENTIRE_WORKTOP")
        ;`,
    }).then(res => {
      if (res.isOk()) {
        closeModal()
      }
    })
  }

  useEffect(() => {
    fetchEggCount().then(value => setCount(value.remaining_eggs));
  }, [])

  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col md:justify-end justify-center">
      <div className="relative w-full">
        <img
          src={FarmBG}
          className="bottom-0 left-0"
        />
        {EGGS.map((egg) => (
          <Egg
            className="absolute w-[10%] aspect-auto"
            style={{ transform: `translate(-50%, -50%)`, ...egg }}
            onClick={openModal}
          />
        ))}
      </div>
      <div
        style={{ clipPath: "polygon(0 0, 100% 0, 100% 70%, 49% 100%, 0 70%)" }}
        className="absolute top-0 left-[5%] w-[12%] h-[20%] bg-[#8B501B] flex flex-col justify-start items-center"
      >
        <div
          className="absolute w-[calc(100%-2px)] h-[calc(100%-1px)] md:w-[calc(100%-4px)] md:h-[calc(100%-2px)] bg-[#E0B136]"
          style={{ clipPath: "polygon(0 0, 100% 0, 100% 70%, 49% 100%, 0 70%)" }}
        />
      </div>
      {/** Egg Buy Modal */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 transform transition-transform duration-500 ease-out"
        style={{
          transform: isOpen ? "translateY(0)" : "translateY(120%)",
        }}>
        <img
          src={ModalBG}
        />
        <div className="absolute inset-0 w-full flex flex-col justify-start items-center">
          <img
            src={EggImg}
            className="w-[20%] z-10 -mt-[5%]"
          />
          <div className="relative bg-black w-[25%] h-[12%] -mt-[3%]"
            style={{ clipPath: "ellipse(50% 50% at 50% 50%)" }}>
          </div>
          <div onClick={buyEgg}
            className="relative py-3 w-[27%] font-bold flex justify-center rounded-2xl overflow-visible cursor-pointer select-none mt-[6%] hover:shadow-green-900 hover:shadow-lg transition-all">
            <div className="absolute top-0 left-0 w-full h-1/2 rounded-t-2xl bg-[#82BA28] border-t-4 border-[#ADF23F]" />
            <div className="absolute bottom-0 left-0 w-full h-1/2 rounded-b-2xl bg-[#74A525]" />
            <span className="relative z-10 lg:text-2xl md:text-xl sm:text-sm text-xs text-nowrap">BUY EGG</span>
            <img
              src={TapIcon}
              className="absolute top-0 right-0 w-[30%]"
              style={{ transform: `translate(30%, -30%)` }}
            />
          </div>
        </div>
        <img
          src={CloseIcon}
          className="absolute top-0 right-0 cursor-pointer w-[10%]"
          style={{ transform: `translate(-30%, -30%)` }}
          onClick={closeModal}
        />
      </div>
      <div className="absolute left-[2%] top-1/2 w-[5%] -translate-y-1/2">
        <div className="aspect-square border-2 border-black bg-[#E0B136] rotate-12 rounded-2xl flex flex-col items-center justify-center">
          <img
            src={EggImg}
            className="h-[70%]"
          />
        </div>
        <div className="border-2 border-black bg-white rounded-full text-black text-center px-2">
          {count} / 1000
        </div>
      </div>
      <div className="absolute right-[3%] top-[5%]">
        {createElement("radix-connect-button")}
      </div>
    </div>
  )
}
