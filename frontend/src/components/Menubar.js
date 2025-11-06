import { useState, useEffect } from 'react';
import { FaShoppingCart } from 'react-icons/fa'; // Using react-icons for the cart
import { Link, useNavigate } from 'react-router-dom';
import UseAuth from '../hook/UseAuth';

const Menubar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { isAuthenticated, logOutUser } = UseAuth();
  const navigate = useNavigate();

  // Dummy data for the cart
  const cartItems = [
    { id: 1, name: 'Pro Whey Protein', quantity: 1, price: 59.99 },
    { id: 2, name: 'Pre-Workout Fuel', quantity: 2, price: 39.99 },
  ];

  const handleLogOut = () => {
    logOutUser();
    navigate('/login');
  }
  // Effect to handle scroll detection
  useEffect(() => {
    const handleScroll = () => {
      // Set state to true if scrollY is more than 100px, otherwise false
      if (window.scrollY > 100) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    // Add event listener when the component mounts
    window.addEventListener('scroll', handleScroll);

    // Cleanup: remove event listener when the component unmounts
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // Empty dependency array means this effect runs only once on mount

  // Function to toggle the cart's visibility
  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  return (
    <header
      className={`
        fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out
        ${isScrolled ? 'bg-black/80 backdrop-blur-sm shadow-lg border-b border-red-500/30' : 'bg-transparent'}
      `}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">
        {/* Logo */}
        <div className="text-2xl font-bold text-white tracking-wider">
          <span className="text-red-500">Fitness</span>Hub
        </div>

        {/* Menu Items */}
        <ul className="hidden md:flex items-center space-x-8 text-white">
          <li><a href="/" className="hover:text-red-500 transition-colors">Home</a></li>
          <li><a href="#classes" className="hover:text-red-500 transition-colors">Classes</a></li>
          <li><a href="#trainers" className="hover:text-red-500 transition-colors">Trainers</a></li>
          <li><a href="#pricing" className="hover:text-red-500 transition-colors">Pricing</a></li>
        </ul>

        {/* Action Buttons */}
        <div className="flex items-center space-x-6">
          {/* Cart Icon and Pop-up */}
          <div className="relative">
            <button onClick={toggleCart} className="text-white text-xl hover:text-red-500 transition-colors">
              <FaShoppingCart />
            </button>
            {isCartOpen && (
              <div className="absolute top-12 right-0 w-72 bg-[#1a1a1a] border border-gray-700 rounded-lg shadow-xl p-4 text-white">
                <h3 className="text-lg font-semibold text-red-400 border-b border-gray-600 pb-2 mb-4">Your Cart</h3>
                {cartItems.length > 0 ? (
                  <ul className="space-y-3">
                    {cartItems.map(item => (
                      <li key={item.id} className="flex justify-between items-center text-sm">
                        <span>{item.name} (x{item.quantity})</span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </li>
                    ))}
                    <li className="border-t border-gray-600 pt-3 mt-3 flex justify-between font-bold">
                      <span>Total:</span>
                      <span>${cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}</span>
                    </li>
                  </ul>
                ) : (
                  <p>Your cart is empty.</p>
                )}
                <button className="w-full mt-4 py-2 bg-red-600 hover:bg-red-700 rounded-md font-semibold transition">
                  Checkout
                </button>
              </div>
            )}
          </div>

          {/* Sign Up Button */}
          {
            isAuthenticated ? <>
              <button onClick={handleLogOut} className="hidden sm:block bg-red-600 text-white font-semibold px-5 py-2 rounded-md hover:bg-red-700 transition-all duration-300 shadow-md">
                Log Out
              </button>
            </> : <>
              <Link to={'/login'}>
                <button className="hidden sm:block bg-red-600 text-white font-semibold px-5 py-2 rounded-md hover:bg-red-700 transition-all duration-300 shadow-md">
                  Login
                </button>
              </Link>
            </>
          }


        </div>
      </nav>
    </header>
  );
};

export default Menubar;