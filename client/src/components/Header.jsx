import React, { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import Search from "./Search";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaRegCircleUser } from "react-icons/fa6";
import useMobile from "../HOOKS/useMobile";
import { BsCart4 } from "react-icons/bs";
import { useSelector } from "react-redux";
import { GoTriangleDown, GoTriangleUp } from "react-icons/go";
import UserMenu from "./UserMenu";
import { DisplayRupees } from "../utils/DisplayRupees";
import { useGlobalContext } from "../provider/GlobalProvider";
import DisplayCartItem from "./DisplayCartItem";

const Header = () => {
  const { totalPrice, totalQty } = useGlobalContext();
  const [isMobile] = useMobile();
  const location = useLocation();
  const isSearchPage = location.pathname === "/search";
  const navigate = useNavigate();
  const user = useSelector((state) => state?.user);
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const cartItem = useSelector((state) => state.cartItem.cart);
  // const [totalPrice, setTotalPrice] = useState(0)
  // const [totalQty, setTotalQty] = useState(0)
  const [openCartSection, setOpenCartSection] = useState(false);

  const redirectToLoginPage = () => {
    navigate("/login");
  };

  const handleCloseUserMenu = () => {
    setOpenUserMenu(false);
  };

  const handleMobileUser = () => {
    if (!user._id) {
      navigate("/login");
      return;
    }

    navigate("/user");
  };

  // //  total items and total price of cart
  // useEffect(() => {
  //   const totalQty  = cartItem.reduce((prev,current) => {
  //     return prev + current.quantity
  //   }, 0)
  //   setTotalQty(totalQty)

  //   const totalPrice = cartItem.reduce((prev,current) => {
  //     return prev + (current.productId.price * current.quantity)
  //   },0)
  //   setTotalPrice(totalPrice)
  // }, [cartItem])

  return (
    <header className="h-24 lg:h-20 lg:shadow-md sticky top-0 z-40 flex justify-center flex-col gap-1 bg-white">
      {!(isSearchPage && isMobile) && (
        <div className="container mx-auto flex items-center justify-between px-2 ">
          {/*  LOGO */}
          <div className="h-full">
            <Link to="/" className="h-full flex justify-between items-center ">
              <img
                src={logo}
                width={170}
                height={60}
                className="hidden lg:block "
                alt=""
              />
              <img
                src={logo}
                width={120}
                height={60}
                className="lg:hidden"
                alt=""
              />
            </Link>
          </div>

          {/* Search */}
          <div className="hidden lg:block ">
            <Search />
          </div>

          {/* Login and cart */}
          <div className="flex ">
            {/* user icon display only in mobile version */}
            <button
              className="text-neutral-600 lg:hidden "
              onClick={handleMobileUser}
            >
              <FaRegCircleUser size={26} />
            </button>

            {/*  Desktop version */}
            <div className="hidden lg:flex items-center gap-10">
              {user?._id ? (
                <div className="relative">
                  <div
                    onClick={() => setOpenUserMenu((prev) => !prev)}
                    className="flex select-none items-center gap-2 cursor-pointer "
                  >
                    <p>Account</p>
                    {openUserMenu ? (
                      <GoTriangleUp size={25} />
                    ) : (
                      <GoTriangleDown size={25} />
                    )}
                  </div>
                  {openUserMenu && (
                    <div className="absolute right-0 top-12">
                      <div className="bg-white rounded p-4 min-w-52 lg:shadow-lg">
                        <UserMenu close={handleCloseUserMenu} />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button onClick={redirectToLoginPage} className="text-lg px-2 ">
                  Login
                </button>
              )}
              <button
                onClick={() => setOpenCartSection(true)}
                className="flex items-center gap-2 bg-secondary-200 hover:bg-green-700 px-3 py-2 rounded text-white "
              >
                {/*  add to cart icon */}
                <div className="animate-bounce ">
                  <BsCart4 size={26} />
                </div>
                <div className="font-semibold">
                  {cartItem[0] ? (
                    <div>
                      <p>{totalQty} Items</p>
                      <p>{DisplayRupees(totalPrice)}</p>
                    </div>
                  ) : (
                    <div>
                      <p>My Cart</p>
                    </div>
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-2 lg:hidden">
        <Search />
      </div>

      {openCartSection && (
        <DisplayCartItem close={() => setOpenCartSection(false)} />
      )}
    </header>
  );
};

export default Header;
