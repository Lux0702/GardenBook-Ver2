import { useState } from "react"
import { API_URL } from "./constant"
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { json, useNavigate } from "react-router-dom";

//get all book
export const useDataBook = () =>{
    const [dataBook, setBooks] = useState([])
    const fetchBooks = async () => {
        try {
          const response = await fetch(`${API_URL}/api/v1/books`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            }
          });
          if (response.ok) {
            const book = await response.json()
            setBooks(book.data)
            localStorage.setItem('books',JSON.stringify(book.data))
            console.log('Get data success', book.data)
            return true;
          } else {
            console.log('Error fetching books:', response.statusText)
            return false;
          }
        } catch (error) {
          console.log('Error fetching books data:', error)
          return false
        }
      }
    
    return  {dataBook, fetchBooks}
}
//Detail book
export const useBookDetail = () =>{
  const [detailBook, setBooks] = useState([])
  const fetchBookDetails = async (id) => {
      try {
        const response = await fetch(`${API_URL}/api/v1/books/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        if (response.ok) {
          const book = await response.json()
          setBooks(book.data)
          //localStorage.setItem('bookData',JSON.stringify(book.data))
          console.log('Get data success', book)
          return book.data;

        } else {
          console.log('Error fetching books:', response.statusText)
          return false;

        }
      } catch (error) {
        console.log('Error fetching books data:', error)
        return false;
      }
    }
  
  return  {detailBook, fetchBookDetails}
}
//Relate Book
export const useBookRelate = () =>{
  const [relateBook, setBooks] = useState([])
  const fetchBookRelates = async (id) => {
      try {
        const response = await fetch(`${API_URL}/api/v1/books/${id}/related`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        if (response.ok) {
          const book = await response.json()
          setBooks(book.data)
          //localStorage.setItem('bookData',JSON.stringify(book.data))
          console.log('Get data  relate success', book)
        } else {
          console.log('Error fetching books relate:', response.statusText)
        }
      } catch (error) {
        console.log('Error fetching books relate  data:', error)
      }
    }
  
  return  {relateBook, fetchBookRelates}
}

//Categories
export const useCategories = () =>{
  const [categories, setCategories] = useState([])
  const[categoriesAll, setCategoriesAll] = useState([])
  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/api/v1/categories`);
      if (response.ok) {
        const data = await response.json();
        setCategories(
          data.data.map((category) => ({
            value: category.id,
            label: category.categoryName,
          })),
        );
        setCategoriesAll(data.data)
        console.log("data category",data.data)
      } else {
        console.error('Error fetching  data:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching  data:', error);
    }
    }
  
  return  {categories,categoriesAll, fetchCategories}
}

//Authors
export const useAuthors = () =>{
  const [authors, setAuthors] = useState([])
  const [authorsAll, setAuthorsAll] = useState([])

  const fetchAuthors = async () => {
    try {
      const response = await fetch(`${API_URL}/api/v1/authors`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (response.ok) {
        const data = await response.json();
        setAuthors(
          data.data.map((author) => ({
            value: author.id,
            label: author.authorName,
          })),
        );
        setAuthorsAll(data.data)
        console.log("data author",data.data)
      } else {
        console.error('Error fetching  data:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching  data:', error);
    }
    }
  
  return  {authors,authorsAll, fetchAuthors}
}
//Login Google
export const useLoginGoogle = () =>{
  const [token, setToken] = useState()
  const fetchTokenGoogle = async (code) => {
    console.log("Login is code",code)

    try 
    {
      const response = await fetch(`${API_URL}/api/v1/auth/loginGoogle/oauth2/code/google?code=${code}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json()
        setToken(data.data);
        localStorage.setItem('token',JSON.stringify(data.data))
        console.log("Login google success",data.data)
        return true
      } else {
        console.error('Error get token:', response.statusText);
        return false

      }   
    } catch (error) {
      console.error('Connect token failed:', error);
      toast.error('Lỗi kết nối')
      return false

    }
    }
  
  return  {token, fetchTokenGoogle}
}
//Register 
export const useRegister = () =>{
  const [flagRegister, setflag] = useState(false)
  const fetchRegister = async (fullName,passWord,email,phone,confirmPassWord) => {
    try 
    {
      const response = await fetch(`${API_URL}/api/v1/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          fullName: fullName,
          email: email,
          phone: phone,
          passWord: passWord,
          confirmPassWord:confirmPassWord }),
      });
      const responseData = await response.json()
      if (responseData.success) {
        setflag(true)
        toast.success(responseData.message || "Đăng ký thành công")
        return true;
      } else {
        console.error('Error login:', response.statusText);
        toast.info(responseData.message || "Đăng ký không thành công")
        return false;

      }   
    } catch (error) {
      console.error('Connect register failed:', error);
      toast.error('Lỗi kết nối')
      return false;

    }
    }
  
  return  {flagRegister, fetchRegister}
}

//Login 
export const useLogin = () => {
  const [flagLogin, setflag] = useState(false);
  const [token, setToken] = useState();

  const fetchLogin = async (username, passWord) => {
    try {
      const response = await fetch(`${API_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: username, passWord }),
      });
      const responseData = await response.json();
      if (responseData.success) {
        setflag(true);
        setToken(responseData.data);
        localStorage.setItem('token', JSON.stringify(responseData.data));
        console.log("Login success", responseData.data);
        toast.success(responseData.message || 'Đăng nhập thành công');
        return true; // Đăng nhập thành công
      } else {
        console.error('Error login:', response.statusText);
        toast.info(responseData.message || 'Đăng nhập lỗi');
        return false; // Đăng nhập thất bại
      }
    } catch (error) {
      console.error('Connect login failed:', error);
      toast.error('Lỗi kết nối');
      return false; // Đăng nhập thất bại
    }
  };

  return { flagLogin, fetchLogin };
};

//sendOTP 
export const useSendOTP = () =>{
  const [flagOTP,setFlag] = useState(false)
  const fetchSendOTP = async (email,url) => {
    try 
    {
      const response = await fetch(`${API_URL}/api/v1/auth/${url}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email, 
        })
      })
      const responseData = await response.json()
      if (responseData.success) {
        setFlag(true)
        // toast.success(responseData.message || 'Gửi mã OTP thành công')
        return true;
      } else {
        console.error('Error send otp:', response.statusText);
        toast.info(responseData.message|| 'OTP lỗi')
        return false;

      }   
    } catch (error) {
      console.error('Connect otp failed:', error);
      toast.error('Lỗi kết nối')
      return false;
    }
    }
  
  return  { flagOTP,fetchSendOTP}
}
//logout 
export const useLogout = () =>{
  const navigate = useNavigate()
  const fetchLogout = async (token) => {
    try 
    {
      const response = await fetch(`${API_URL}/api/v1/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.accessToken}`, 
        },
        body: JSON.stringify({ refreshToken: token.refreshToken }),
      });
      const responseData = await response.json()
      if (responseData.success) {
        localStorage.removeItem('token')
        localStorage.removeItem("userInfo");
        console.log("Logout google success",responseData.data)
        toast.success(responseData.message || "Đăng xuất thành công")
        setTimeout(() => {
          navigate('/login');
        }, 1000);
      } else {
        console.error('Error login:', response.statusText);
      }   
    } catch (error) {
      console.error('Connect login failed:', error);
    }
    }
  
  return  { fetchLogout}
}

//get profile
export const useProfile = () =>{
  const [userData, setUserData] = useState()
  const fetchProfileData = async (token) => {
    try {
      const response = await fetch(`${API_URL}/api/v1/user/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, 
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserData(data.data)
        localStorage.setItem("userInfo", JSON.stringify(data.data));

        console.log('user data:',data.data)
      } else {
        console.error('Error fetching profile data:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
    } 
  };
  
  return  {userData, fetchProfileData}
}

//add to cart
export const useAddToCart = () =>{
  const fetchAddToCart = async (token,id,quantity) => {
    try {
      const response = await fetch(`${API_URL}/api/v1/books/${id}/addToCart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, 
        },
        body: JSON.stringify({
          bookID: id,
          quantity: quantity,
        }),
      });
      const responseData = await response.json();
      if (responseData.success) {
        toast.success(responseData.message || 'Đã thêm sản phẩm vào giỏ hàng');
        return true;
        // Thực hiện các xử lý khác nếu cần
      } else {
        toast.error(responseData.message || 'Lỗi thêm vào giỏ hàng');
        return false;

      }
    } catch (error) {
      console.log('Lỗi kết nối:', error);
      return false;

    } 
  };
  
  return  { fetchAddToCart}
}


//add to wishlist
export const useAddToWishList = () =>{
  const fetchAddToWishList = async (token,id) => {
    try {
      console.log('token is:', token);
      const response = await fetch(`${API_URL}/api/v1/books/${id}/addToWishList`, {
        method: 'POST',
        headers: {
        Authorization: `Bearer ${token}`, 
        'Content-Type': 'application/json',
        },
    });
    const updatedData = await response.json();
    if (updatedData.success) {
        console.log('Profile updated successfully:', updatedData);
        toast.success(updatedData.message || 'Thêm thành công')
    } else {
        console.error('Lỗi thêm vào wish list:', response.statusText);
        toast.info(updatedData.message || 'Lỗi thêm vào danh sách yêu thích')
    
    }
    } catch (error) {
      console.log('Lỗi kết nối:', error);
    } 
  };
  
  return  { fetchAddToWishList}
}
// get wish list
export const useDataWishList = () =>{
  const [wishList, setBooks] = useState([])
  const fetchWishListBooks = async (token) => {
      try {
        const response = await fetch(`${API_URL}/api/v1/customer/wishList`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`, 
            'Content-Type': 'application/json',
          }
        });
        const responseData = await response.json()
        if (responseData.success) {
          setBooks(responseData.data)
          //localStorage.setItem('bookData',JSON.stringify(book.data))
          console.log('Get data success', responseData)
        } else {
          console.log('Error fetching wish books:', response.statusText)
        }
      } catch (error) {
        console.log('Error fetching wish books data:', error)
      }
    }
  
  return  {wishList, fetchWishListBooks}
}

//get verify otp
export const useVerifyOtp = () =>{
  const fetchVerifyOtp = async (otpCode, email) => {
    try {
      console.log('otp, email', otpCode,email);
      const response = await fetch(`${API_URL}/api/v1/auth/verify-OTP`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ otp: otpCode, 
          email: email }),
      });
      const successData = await response.json();
      if (successData.success && response.ok) {
        return true
      } else {
        toast.error(successData.message || "Xác nhận mã OTP thất bại. Vui lòng nhập lại.");
        return false;
      }
    } catch (error) {
      console.error("Lỗi trong quá trình xác nhận:", error);
      return false;
    }
  }
  return {fetchVerifyOtp}
   
}

//reset forgot password
export const useResetPassword = () =>{
  const fetchResetPassword = async (passWord,confirmPassWord, email) => {
    try {
      console.log('otp, email', passWord,email);
      const response = await fetch(`${API_URL}/api/v1/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ passWord: passWord, 
          email: email,
          confirmPassWord:confirmPassWord, }),
      });
      const successData = await response.json();
      if (successData.success) {
        return true
      } else {
        toast.error(successData.message || "Cập nhật mật khẩu lỗi");
        return false
      }
    } catch (error) {
      console.error("Lỗi trong quá trình xác nhận:", error);
      // toast.error("Đã xảy ra lỗi trong quá trình xác nhận. Vui lòng thử lại.");
      return false
    }
  }
  return {fetchResetPassword}
   
}


//upload profile
export const useUploadProfile = () =>{
  const [userUpdate, setUserData] = useState()
  const fetchUploadProfile = async (token,formData) => {
    try {
      console.log("Before:",formData)
      const response = await fetch(`${API_URL}/api/v1/user/profile/updateProfile`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`, 
        },
        body:formData,
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setUserData(data.data)
        localStorage.setItem("userInfo", JSON.stringify(data.data));
        console.log('user data:',data.data)
        return true;
      } else {
        console.error('Error fetching profile data:', response.statusText);
        return false;
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
      return false;

    } 
  };
  
  return  {userUpdate, fetchUploadProfile}
}

//changepassword
export const useChangePassword = () =>{
  const fetchChangePassword = async (token,value) => {
    try {
      const response = await fetch(`${API_URL}/api/v1/user/change-password`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, 
        },
        body:JSON.stringify({
          oldPassWord: value.oldPassWord,
          passWord: value.passWord,
          confirmPassWord: value.confirmPassWord,
        }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        return true;
      } else {
        toast.error(data.message || 'Cập nhật không thành công')
        console.error('Error fetching change data:', data.data );

        return false;
      }
    } catch (error) {
      console.error('Error fetching change data:', error);
      return false;

    } 
  };
  
  return  {fetchChangePassword}
}

//get addresses
export const useUploadAddresses = () =>{
  const fetchAddressData = async (token) => {
    try {
      const response = await fetch(`${API_URL}/api/v1/user/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, 
        },
      });
      const data = await response.json();
      if (response.ok) {
        console.log('user data:',data.data)
        return true;
      } else {
        console.error('Error fetching profile data:', response.statusText);
        return false;
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
      return false;
    } 
  };
  
  return  { fetchAddressData}
}

//Get all cartItem
export const useCartData = () =>{
  const fetchCartData = async (token) => {
    try {
      const response = await fetch(`${API_URL}/api/v1/customer/cart`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, 
        },
      });
      const data = await response.json();
      if (response.ok) {
        console.log('cart data:',data.data.items)
        return data.data.items;
      } else {
        console.error('Error fetching cart data:', response.statusText);
        return false;

      }
    } catch (error) {
      console.error('Error fetching cart data:', error);
      return false;

    } 
  };
  
  return  {fetchCartData}
}

//Get update cartItem
export const useUpdateCart = () =>{
  const fetchUpdateCart = async (bookId, quantity) => {
    try {
      const tokenString = localStorage.getItem('token');
      const token = JSON.parse(tokenString);
      const response = await fetch(`${API_URL}/api/v1/customer/cart/updateCartItem`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token?.accessToken}`, 
        },
        body: JSON.stringify({
          bookID:bookId,
          quantity:quantity,
        })
      });
      const data = await response.json();
      if (response.ok) {
        console.log('cart data:',data.data.items)
        return true;
      } else {
        console.error('Error fetching cart data:', data.data);
        return false;

      }
    } catch (error) {
      console.error('Error fetching cart data:', error);
      return false;

    } 
  };
  
  return  {fetchUpdateCart}
}

//Get delete cartItem
export const useDeleteCart = () =>{
  const fetchDeleteCart = async (Id) => {
    try {
      const tokenString = localStorage.getItem('token');
      const token = JSON.parse(tokenString);
      const response = await fetch(`${API_URL}/api/v1/customer/cart/removeCartItem`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token?.accessToken}`, 
        },
        body: JSON.stringify({
          cartItemID:Id,
        })
      });
      const data = await response.json();
      if (response.ok) {
        console.log('cart data after delete:',data.data.items)
        return true;
      } else {
        console.error('Error fetching cart data:', data.data);
        return false;

      }
    } catch (error) {
      console.error('Error fetching cart data:', error);
      return false;

    } 
  };
  
  return  {fetchDeleteCart}
}


//update address
export const useUpdateAddress = () =>{
  const fetchUpdateAddress = async (addresses) => {
    try {
      console.log('data upload address:',addresses)
        const userInfoString = localStorage.getItem("token");
        const token=JSON.parse(userInfoString)
        console.log('token',token?.accessToken)
        const response = await fetch(`${API_URL}/api/v1/user/profile/updateAddresses`, {
            method: 'PUT',
            headers: {
            Authorization: `Bearer ${token?.accessToken}`, 
            'Content-Type': 'application/json',
            },
            body:JSON.stringify({addresses: addresses}),
        });
        const updatedData = await response.json();
        if (response.ok) {
            console.log('Profile updated successfully:', updatedData);
            localStorage.setItem('userInfo',JSON.stringify(updatedData.data));
            return true;
        } else {
            const updatedData = await response.json();
            console.error('Lỗi upload profile:', updatedData.data);
            toast.error(updatedData.message)
            return false;
        }
    } catch (error) {
    toast.error('Lỗi kết nối:', error);
    return false;
    }
  };
  
  return  {fetchUpdateAddress}
}

//update create order
export const useCreateOrder = () =>{
  const fetchCreateOrder = async (orderData) => {
    try {
      console.log('data order address:',orderData)
        const userInfoString = localStorage.getItem("token");
        const token=JSON.parse(userInfoString)
        console.log('token',token?.accessToken)
        const response = await fetch(`${API_URL}/api/v1/customer/orders/create`, {
            method: 'POST',
            headers: {
            Authorization: `Bearer ${token?.accessToken}`, 
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData),
        });
        const updatedData = await response.json();
        if (updatedData.success) {
            console.log('Order  successfully:', updatedData.message);
            localStorage.setItem('orderID',JSON.stringify(updatedData.data._id))
            return true;
        } else {
            console.error('Lỗi đặt hàng order:', updatedData.data);
            toast.warning(updatedData.message)
            return false;
        }
    } catch (error) {
    toast.error('Lỗi kết nối:', error);
    return false;
    }
  };
  const fetchPayment = async (amount)=>{
    try {
      const userInfoString = localStorage.getItem("token");
      const token=JSON.parse(userInfoString)
      console.log('token',token?.accessToken)
      const response = await fetch(`${API_URL}/api/v1/customer/orders/payment/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token?.accessToken}`,
        },
        body: JSON.stringify({
          amount:amount
        }),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log("đến trang thanh toán")
        console.log('URL:', data.data.url);
        // window.open(data.data.url,'_parent', 'height=600,width=800');
        window.location.href=data.data.url;
        
      } else {
        const errorData = await response.json();
        toast.error('Lỗi khi thanh toán:', errorData.message);
        console.log("Lỗi thanh toán:",errorData.data)

      }
    } catch (error) {
      toast.error('Lỗi kết nối:', error);
    }
  }
  
  return  {fetchCreateOrder,fetchPayment}
}
// get order history
export const useHistoryOrder = () =>{
  const fetchHistoryOrder = async () => {
    const tokenString = localStorage.getItem('token')
    const token = JSON.parse(tokenString)
    try {
      const response = await fetch(`${API_URL}/api/v1/customer/orders`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token?.accessToken}`, 
        },
      });
      const data = await response.json();
      if (response.ok) {
        console.log('cart data:',data.data)
        return data.data;
      } else {
        console.error('Error fetching cart data:', data.data);
        return false;

      }
    } catch (error) {
      console.error('Error fetching cart data:', error);
      return false;

    } 
  };
  
  return  {fetchHistoryOrder}
}
//review book
export const useReviewBook = () =>{
  const fetchReviewBook = async (id,review,rating) => {
    const tokenString = localStorage.getItem('token')
    const token = JSON.parse(tokenString)
    try {
      const response = await fetch(`${API_URL}/api/v1/customer/${id}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token?.accessToken}`, 
        },
        body: JSON.stringify({
          review: review,
          rating: rating,
        })
      });
      const data = await response.json();
      if (response.ok) {
        console.log("reaview book success",data.data)
        return true;
      } else {
        console.error('Error review data:', data.data);
        return false;

      }
      } catch (error) {
        console.error('Error connect review data:', error);
        return false;
      }
  };
  
  return  {fetchReviewBook}
}

//get searchlist
export const useSearchList = () =>{
  const [searchList, setSearchList] = useState()
  const fetchSearchList = async (token) => {
    try {
      const response = await fetch(`${API_URL}/api/v1/user/search-history`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, 
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSearchList(data.data)
        // localStorage.setItem("userInfo", JSON.stringify(data.data));

        console.log('user data:',data.data)
      } else {
        console.error('Error fetching profile data:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
    } 
  };
  
  return  {searchList, fetchSearchList}
}

//get best seller book
export const useBestSeller = () =>{
  const [bestSeller, setBooks] = useState([])
  const fetchBestSeller = async () => {
      try {
        const response = await fetch(`${API_URL}/api/v1/books/best-seller`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        if (response.ok) {
          const book = await response.json()
          setBooks(book.data)
          //localStorage.setItem('bookData',JSON.stringify(book.data))
          console.log('Get data best seller success', book.data)
          localStorage.setItem('bestSeller',JSON.stringify(book.data))
          return true;
        } else {
          console.log('Error fetching books:', response.statusText)
          return false;
        }
      } catch (error) {
        console.log('Error fetching books data:', error)
        return false
      }
    }
  
  return  {bestSeller, fetchBestSeller}
}

//Get all cartItem
export const useCheckOut = () =>{
  const fetchCheckOut = async (id, code) => {
    try {
      const tokenString = localStorage.getItem('token');
      const token = JSON.parse(tokenString);
      const response = await fetch(`${API_URL}/api/v1/customer/orders/payment/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token?.accessToken}`, 
        },
        body: JSON.stringify({
          orderId: id,
          responseCode: code,
      })
      });
      const data = await response.json();
      if (response.ok) {
        console.log('checkout data:',data.data)
        return true;
      } else {
        console.error('Error fetching cart data:', data.data);
        return false;

      }
    } catch (error) {
      console.error('Error fetching cart data:', error);
      return false;

    } 
  };
  
  return  {fetchCheckOut}
}

//Get delete search
export const useDeleteSearch = () =>{
  const fetchDeleteSearch = async (search) => {
    try {
      console.log('search delete:',search)
      const tokenString = localStorage.getItem('token');
      const token = JSON.parse(tokenString);
      const response = await fetch(`${API_URL}/api/v1/user/search-history/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token?.accessToken}`, 
        },
        body: JSON.stringify({
          searchQuery:search,
        })
      });
      const data = await response.json();
      if (response.ok) {
        return true;
      } else {
        console.error('Error fetching cart data:', data.data);
        return false;

      }
    } catch (error) {
      console.error('Error fetching cart data:', error);
      return false;

    } 
  };
  
  return  {fetchDeleteSearch}
}
//Get save search
export const useSaveSearch = () =>{
  const fetchSaveSearch = async (search) => {
    try {
      const tokenString = localStorage.getItem('token');
      const token = JSON.parse(tokenString);
      const response = await fetch(`${API_URL}/api/v1/user/search-history/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token?.accessToken}`, 
        },
        body: JSON.stringify({
          searchQuery:search,
        })
      });
      const data = await response.json();
      if (response.ok) {
        console.log('cart data:',data.data.items)
        return true;
      } else {
        console.error('Error fetching cart data:', data.data);
        return false;

      }
    } catch (error) {
      console.error('Error fetching cart data:', error);
      return false;

    } 
  };
  
  return  {fetchSaveSearch}
}
// cancel order
export const useCancelOrder = () =>{
  const fetchCancelOrder = async (id) => {
      try {
        const tokenString = localStorage.getItem('token');
        const token = JSON.parse(tokenString);
        const response = await fetch(`${API_URL}/api/v1/customer/orders/${id}/cancel`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token?.accessToken}`, 
          },
        });
        const data = await response.json()
        if (response.ok) {
          //localStorage.setItem('bookData',JSON.stringify(book.data))
          console.log('Get data success', data.message)
          return true;
        } else {
          console.log('Error fetching books:', data.data)
          return false;
        }
      } catch (error) {
        console.log('Error fetching books data:', error)
        return false;
      }
    }
  
  return  {fetchCancelOrder}
}

//get all post
export const useDataPost = () =>{
  const [dataPost, setBooks] = useState([])
  const fetchPosts = async () => {
      try {
        const response = await fetch(`${API_URL}/api/v1/posts`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        if (response.ok) {
          const post = await response.json()
          setBooks(post.data)
          // localStorage.setItem('post',JSON.stringify(post.data))
          console.log('Get data success', post.data)
          return true;
        } else {
          console.log('Error fetching books:', response.statusText)
          return false;
        }
      } catch (error) {
        console.log('Error fetching books data:', error)
        return false
      }
    }
  
  return  {dataPost, fetchPosts}
}

//get recommend
export const useRecommendBook = () =>{
  const [recommendBook, setBooks] = useState([])
  const fetchRecommendBook = async () => {
      try {
        const tokenString = localStorage.getItem('token');
        const token = JSON.parse(tokenString);
        const response = await fetch(`${API_URL}/api/v1/customer/recommended-books`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token?.accessToken}`, 
          }
        });
        if (response.ok) {
          const post = await response.json()
          setBooks(post)
          // localStorage.setItem('post',JSON.stringify(post.data))
          console.log('Get recommend success', post)
          return true;
        } else {
          console.log('Error fetching books:', response.statusText)
          return false;
        }
      } catch (error) {
        console.log('Error fetching books data:', error)
        return false
      }
    }
  
  return  {recommendBook, fetchRecommendBook}
}

//add post
export const useCreatePost = () => {
  const fetchCreatePost = async (postData) => {
    try {
      console.log('post add:', postData)
      const tokenString = localStorage.getItem('token');
      const token = JSON.parse(tokenString);
      const response = await fetch(`${API_URL}/api/v1/posts/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token?.accessToken}`,
        },
        body: JSON.stringify(postData)
      });
      const post = await response.json();

      if (response.ok) {
        console.log('Post creation success', post.message);
        return true;
      } else {
        console.log('Error creating post:', post.data);
        return false;
      }
    } catch (error) {
      console.log('Error creating post:', error);
      return false;
    }
  }

  return { fetchCreatePost }
}

// get post history
export const useHistoryPost = () =>{
  const [historyPost,setHistoryPost]= useState([])
  const fetchHistoryPost = async () => {
    const tokenString = localStorage.getItem('token')
    const token = JSON.parse(tokenString)
    try {
      const response = await fetch(`${API_URL}/api/v1/customer/posts`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token?.accessToken}`, 
        },
      });
      const data = await response.json();
      if (response.ok) {
        console.log('cart data:',data.data)
         setHistoryPost(data.data);
         return true;
      } else {
        console.error('Error fetching cart data:', data.data);
        return false;

      }
    } catch (error) {
      console.error('Error fetching cart data:', error);
      return false;

    } 
  };
  
  return  {historyPost,fetchHistoryPost}
}

//edit post
export const useEditPost = () => {
  const fetchEditPost = async (postData,id) => {
    try {
      console.log('post add:', postData)
      const tokenString = localStorage.getItem('token');
      const token = JSON.parse(tokenString);
      const response = await fetch(`${API_URL}/api/v1/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token?.accessToken}`,
        },
        body: JSON.stringify(postData)
      });
      const post = await response.json();

      if (response.ok) {
        console.log('Post creation success', post.message);
        return true;
      } else {
        console.log('Error edit post:', post.data);
        return false;
      }
    } catch (error) {
      console.log('Error edit post:', error);
      return false;
    }
  }

  return { fetchEditPost }
}



/////////////////////////////////////////////////////////////////
//Admin//
/////////////////////////////////////////////////////////////////
// get all user
export const useGetAllUser = () =>{
  const [allUser,setAllUser]= useState([])
  const fetchGetAllUser= async () => {
    const tokenString = localStorage.getItem('tokenAdmin')
    const token = JSON.parse(tokenString)
    try {
      const response = await fetch(`${API_URL}/api/v1/admin/dashboard/users`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token?.accessToken}`, 
        },
      });
      const data = await response.json();
      if (response.ok) {
        console.log('all user data:',data.data)
        setAllUser(data.data);
         return true;
      } else {
        console.error('Error fetching all user data:', data.data);
        return false;

      }
    } catch (error) {
      console.error('Error fetching all user data:', error);
      return false;

    } 
  };
  
  return  {allUser,fetchGetAllUser}
}
//blacklist
export const useGetBlackList = () =>{
  const [blacklist,setAllUser]= useState([])
  const fetchGetAllUser= async () => {
    const tokenString = localStorage.getItem('tokenAdmin')
    const token = JSON.parse(tokenString)
    try {
      const response = await fetch(`${API_URL}/api/v1/admin/blacklist`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token?.accessToken}`, 
        },
      });
      const data = await response.json();
      if (response.ok) {
        console.log('all user data:',data.data)
        setAllUser(data.data);
         return true;
      } else {
        console.error('Error fetching all user data:', data.data);
        return false;

      }
    } catch (error) {
      console.error('Error fetching all user data:', error);
      return false;

    } 
  };
  
  return  {blacklist,fetchGetAllUser}
}
//Restore  blacklist
export const useRestoreBlackList = () =>{
  const fetchRestoreBlackList= async (id) => {
    const tokenString = localStorage.getItem('tokenAdmin')
    const token = JSON.parse(tokenString)
    try {
      const response = await fetch(`${API_URL}/api/v1/admin/blacklist/${id}/restore`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token?.accessToken}`, 
        },
      });
      const data = await response.json();
      if (response.ok) {
        console.log('all user data:',data.message)
         return true;
      } else {
        console.error('Error fetching all user data:', data.data);
        return false;

      }
    } catch (error) {
      console.error('Error fetching all user data:', error);
      return false;

    } 
  };
  
  return  {fetchRestoreBlackList}
}
//login Admin
export const useLoginAdmin = () => {
  const [flagLogin, setflag] = useState(false);
  const fetchLoginAdmin= async (username, passWord) => {
    try {
      const response = await fetch(`${API_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: username, passWord }),
      });
      const responseData = await response.json();
      if (responseData.success) {
        setflag(true);
        localStorage.setItem('tokenAdmin', JSON.stringify(responseData.data));
        console.log("Login success", responseData.data);
        toast.success(responseData.message || 'Đăng nhập thành công');
        return true; // Đăng nhập thành công
      } else {
        console.error('Error login:', response.statusText);
        toast.info(responseData.message || 'Đăng nhập lỗi');
        return false; // Đăng nhập thất bại
      }
    } catch (error) {
      console.error('Connect login failed:', error);
      toast.error('Lỗi kết nối');
      return false; // Đăng nhập thất bại
    }
  };

  return { flagLogin, fetchLoginAdmin };
};

//add  blacklist
export const useAddBlackList = () =>{
  const fetchAddBlackList= async (userId,reason) => {
    const tokenString = localStorage.getItem('tokenAdmin')
    const token = JSON.parse(tokenString)
    try {
      const response = await fetch(`${API_URL}/api/v1/admin/blacklist/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token?.accessToken}`, 
        },
        body: JSON.stringify({
           userId: userId,
           reason: reason,
        })
      });
      const data = await response.json();
      if (response.ok) {
        console.log('all user data:',data.message)
         return true;
      } else {
        console.error('Error fetching all user data:', data.data);
        return false;

      }
    } catch (error) {
      console.error('Error fetching all user data:', error);
      return false;

    } 
  };
  
  return  {fetchAddBlackList}
}
// get all post for admin
export const useGetAllPost = () =>{
  const [allPost,setAllPost]= useState([])
  const fetchAllPost = async () => {
    const tokenString = localStorage.getItem('tokenAdmin')
    const token = JSON.parse(tokenString)
    try {
      const response = await fetch(`${API_URL}/api/v1/admin/dashboard/posts`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token?.accessToken}`, 
        },
      });
      const data = await response.json();
      if (response.ok) {
        console.log('post all :',data.data)
        setAllPost(data.data);
         return true;
      } else {
        console.error('Error fetching post data:', data.data);
        return false;

      }
    } catch (error) {
      console.error('Error fetching post data:', error);
      return false;

    } 
  };
  
  return  {allPost,fetchAllPost}
}
// change status post for admin
export const useChangeStatusPost = () =>{
  const fetchChangeStatusPost = async (id,status) => {
    const tokenString = localStorage.getItem('tokenAdmin')
    const token = JSON.parse(tokenString)
    try {
      const response = await fetch(`${API_URL}/api/v1/admin/dashboard/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token?.accessToken}`, 
        },
        body: JSON.stringify({
          status: status,
        })
      });
      const data = await response.json();
      if (response.ok) {
        console.log('post all :',data.data)
         return true;
      } else {
        console.error('Error fetching post data:', data.data);
        return false;

      }
    } catch (error) {
      console.error('Error fetching post data:', error);
      return false;

    } 
  };
  
  return  {fetchChangeStatusPost}
}
// get statistic for admin
export const useGetStatistic = () =>{
  const [statistic,setStatistic]= useState([])
  const fetchGetStatistic = async () => {
    const tokenString = localStorage.getItem('tokenAdmin')
    const token = JSON.parse(tokenString)
    try {
      const response = await fetch(`${API_URL}/api/v1/admin/statistics`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token?.accessToken}`, 
        },
      });
      const data = await response.json();
      if (response.ok) {
        console.log('statistic all :',data.data)
        setStatistic(data.data);
         return true;
      } else {
        console.error('Error fetching statistic data:', data.data);
        return false;

      }
    } catch (error) {
      console.error('Error fetching statistic data:', error);
      return false;

    } 
  };
  
  return  {statistic,fetchGetStatistic}
}

// delete user for admin
export const useDeleteUser = () =>{
  const fetchDeleteUser = async (id) => {
    const tokenString = localStorage.getItem('tokenAdmin')
    const token = JSON.parse(tokenString)
    try {
      const response = await fetch(`${API_URL}/api/v1/admin/dashboard/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token?.accessToken}`, 
        },
      });
      const data = await response.json();
      if (response.ok) {
        console.log('delete  :',data.data)
         return true;
      } else {
        console.error('Error fetching delete data:', data.data);
        return false;

      }
    } catch (error) {
      console.error('Error fetching delete data:', error);
      return false;

    } 
  };
  
  return  {fetchDeleteUser}
}

//Register manager 
export const useRegisterManager = () =>{
  const fetchRegisterManager = async (data) => {
    try 
    {
      const tokenString = localStorage.getItem('tokenAdmin')
      const token = JSON.parse(tokenString)
      const response = await fetch(`${API_URL}/api/v1/admin/register-manager`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token?.accessToken}`, 

        },
        body: JSON.stringify({ 
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          passWord: data.passWord,
          confirmPassWord:data.confirmPassWord }),
      });
      const responseData = await response.json()
      if (responseData.success) {
        // toast.success(responseData.message || "Đăng ký thành công")
        return true;
      } else {
        console.error('Error login:', responseData.data);
        // toast.info(responseData.message || "Đăng ký không thành công")
        return false;

      }   
    } catch (error) {
      console.error('Connect register failed:', error);
      toast.error('Lỗi kết nối')
      return false;

    }
    }
  
  return  {fetchRegisterManager}
}

// add author for admin
export const useAddAuthor = () =>{
  const fetchAddAuthor = async (authorName) => {
    const tokenString = localStorage.getItem('tokenAdmin')
    const token = JSON.parse(tokenString)
    try {
      const response = await fetch(`${API_URL}/api/v1/authors/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token?.accessToken}`, 
        },
        body: JSON.stringify({
          authorName:authorName,
        })
      });
      const data = await response.json();
      if (response.ok) {
        console.log('delete  :',data.data)
         return true;
      } else {
        console.error('Error fetching delete data:', data.data);
        return false;

      }
    } catch (error) {
      console.error('Error fetching delete data:', error);
      return false;

    } 
  };
  
  return  {fetchAddAuthor}
}
// update author for admin
export const useUpdateAuthor = () =>{
  const fetchUpdateAuthor = async (authorName, id) => {
    const tokenString = localStorage.getItem('tokenAdmin')
    const token = JSON.parse(tokenString)
    try {
      const response = await fetch(`${API_URL}/api/v1/authors/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token?.accessToken}`, 
        },
        body: JSON.stringify({
          authorName:authorName,
        })
      });
      const data = await response.json();
      if (response.ok) {
        console.log('delete  :',data.data)
         return true;
      } else {
        console.error('Error fetching delete data:', data.data);
        return false;

      }
    } catch (error) {
      console.error('Error fetching delete data:', error);
      return false;

    } 
  };
  
  return  {fetchUpdateAuthor}
}

// add category for admin
export const useAddCategory = () =>{
  const fetchAddCategory = async (categoryName) => {
    const tokenString = localStorage.getItem('tokenAdmin')
    const token = JSON.parse(tokenString)
    try {
      const response = await fetch(`${API_URL}/api/v1/categories/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token?.accessToken}`, 
        },
        body: JSON.stringify({
          categoryName:categoryName,
        })
      });
      const data = await response.json();
      if (response.ok) {
        console.log('delete  :',data.data)
         return true;
      } else {
        console.error('Error fetching add data:', data.data);
        return false;

      }
    } catch (error) {
      console.error('Error fetching add data:', error);
      return false;

    } 
  };
  
  return  {fetchAddCategory}
}
// update author for admin
export const useUpdateCategory = () =>{
  const fetchUpdateCategory = async (categoryName, id) => {
    const tokenString = localStorage.getItem('tokenAdmin')
    const token = JSON.parse(tokenString)
    try {
      const response = await fetch(`${API_URL}/api/v1/categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token?.accessToken}`, 
        },
        body: JSON.stringify({
          categoryName:categoryName,
        })
      });
      const data = await response.json();
      if (response.ok) {
        console.log('delete  :',data.data)
         return true;
      } else {
        console.error('Error fetching delete data:', data.data);
        return false;

      }
    } catch (error) {
      console.error('Error fetching delete data:', error);
      return false;

    } 
  };
  
  return  {fetchUpdateCategory}
}
// update cate for admin
export const useDeleteAuthor = () =>{
  const fetchDeleteAuthor = async (id) => {
    const tokenString = localStorage.getItem('tokenAdmin')
    const token = JSON.parse(tokenString)
    try {
      const response = await fetch(`${API_URL}/api/v1/authors/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token?.accessToken}`, 
        },
      });
      const data = await response.json();
      if (response.ok) {
        console.log('delete  :',data.data)
         return true;
      } else {
        console.error('Error fetching delete data:', data.data);
        return false;

      }
    } catch (error) {
      console.error('Error fetching delete data:', error);
      return false;

    } 
  };
  
  return  {fetchDeleteAuthor}
}
// update cate for admin
export const useDeleteCategory = () =>{
  const fetchDeleteCategory = async (id) => {
    const tokenString = localStorage.getItem('tokenAdmin')
    const token = JSON.parse(tokenString)
    try {
      const response = await fetch(`${API_URL}/api/v1/categories/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token?.accessToken}`, 
        },
      });
      const data = await response.json();
      if (response.ok) {
        console.log('delete  :',data.data)
         return true;
      } else {
        console.error('Error fetching delete data:', data.data);
        return false;

      }
    } catch (error) {
      console.error('Error fetching delete data:', error);
      return false;

    } 
  };
  
  return  {fetchDeleteCategory}
}

//get all delected book
export const useDeletedBook = () =>{
  const [deletedBook, setDeletedBooks] = useState([])
  const fetchDeletedBook = async () => {
      try {
        const tokenString = localStorage.getItem('tokenAdmin')
        const token = JSON.parse(tokenString)
        const response = await fetch(`${API_URL}/api/v1/books//deleted`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token?.accessToken}`, 
          }
        });
        if (response.ok) {
          const book = await response.json()
          setDeletedBooks(book.data)
          console.log('Get data success', book.data)
          return true;
        } else {
          console.log('Error fetching books:', response.statusText)
          return false;
        }
      } catch (error) {
        console.log('Error fetching books data:', error)
        return false
      }
    }
  
  return  {deletedBook, fetchDeletedBook}
}

//add book
export const useAddBooks = () =>{
  const fetchAddBooks = async (formData) => {
    try {
      const tokenString = localStorage.getItem('tokenAdmin')
      const token = JSON.parse(tokenString)
      console.log("Before:",...formData)
      const response = await fetch(`${API_URL}/api/v1/books/add`, {
        method: 'post',
        headers: {
          Authorization: `Bearer ${token?.accessToken}`, 
        },
        body:formData,
      });
      const data = await response.json();
      if (response.ok && data.success) {
        console.log('add data:',data.data)
        return true;
      } else {
        console.error('Error fetching add data:', data.data);
        return false;
      }
    } catch (error) {
      console.error('Error fetching add data:', error);
      return false;

    } 
  };
  
  return  {fetchAddBooks}
}
//update book
export const useUpdateBooks = () =>{
  const [updateBook, setUpdateBooks] = useState()
  const fetchUpdateBooks = async (formData,id) => {
    try {
      const tokenString = localStorage.getItem('tokenAdmin')
      const token = JSON.parse(tokenString)
      console.log("Before:",formData)
      const response = await fetch(`${API_URL}/api/v1/books/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token?.accessToken}`, 
        },
        body:formData,
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setUpdateBooks(data.data)
        console.log('update data:',data.data)
        return true;
      } else {
        console.error('Error fetching update data:', data.data);
        return false;
      }
    } catch (error) {
      console.error('Error fetching update data:', error);
      return false;

    } 
  };
  
  return  {updateBook, fetchUpdateBooks}
}
//delete book
export const useDeleteBooks = () =>{
  const fetchDeleteBooks = async (id) => {
    try {
      console.log('Delete data id:',id)
      const tokenString = localStorage.getItem('tokenAdmin')
      const token = JSON.parse(tokenString)
      const response = await fetch(`${API_URL}/api/v1/books/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token?.accessToken}`, 
        },
      });
      const data = await response.json();
      if (response.ok && data.success) {
        console.log('Delete data:',data.data)
        return true;
      } else {
        console.error('Error fetching Delete data:', data.data);
        return false;
      }
    } catch (error) {
      console.error('Error fetching Delete data:', error);
      return false;

    } 
  };
  
  return  {fetchDeleteBooks}
}

// get all order 

export const useGetAllOrder = () =>{
  const fetchGetOrder = async (page = 1, size = 10) => {
    const tokenString = localStorage.getItem('tokenAdmin');
    const token = JSON.parse(tokenString);
    try {
      const response = await fetch(`${API_URL}/api/v1/orders?page=${page}&size=${size}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token?.accessToken}`,
        }
      });
      const data = await response.json();
      if (response.ok) {
        console.log('all orders data:', data.data.content);
        return data.data;
      } else {
        console.error('Error fetching order data:', data.data);
        return false;
      }
    } catch (error) {
      console.error('Error fetching order data:', error);
      return false;
    }
  };

  return { fetchGetOrder }
}

// get change status order 
export const useUpdateOrderStatus = () =>{
  const fetchUpdateOrderStatus = async (id,status) => {
    const tokenString = localStorage.getItem('tokenAdmin')
    const token = JSON.parse(tokenString)
    try {
      const response = await fetch(`${API_URL}/api/v1/orders/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token?.accessToken}`, 
        },
        body: JSON.stringify({
          status:status,
        })
      });
      const data = await response.json();
      if (response.ok) {
        console.log('update orders data:',data.data)
        return true
      } else {
        console.error('Error update data:', data.data);
        return false;

      }
    } catch (error) {
      console.error('Error fetching update data:', error);
      return false;

    } 
  };
  
  return  {fetchUpdateOrderStatus}
}

// get change read notify 
export const useChangeRead = () =>{
  const fetchChangeRead = async (id,status) => {
    const tokenString = localStorage.getItem('token')
    const token = JSON.parse(tokenString)
    try {
      const response = await fetch(`${API_URL}/api/v1/notifications/${id}/read`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token?.accessToken}`, 
        },
        body: JSON.stringify({
          status:status,
        })
      });
      const data = await response.json();
      if (response.ok) {
        console.log('update orders data:',data.data)
        return true
      } else {
        console.error('Error update data:', data.data);
        return false;

      }
    } catch (error) {
      console.error('Error fetching update data:', error);
      return false;

    } 
  };
  
  return  {fetchChangeRead}
}
export const useGetDiscounts = () => {
  const [discounts, setDiscounts] = useState([]);

  const fetchDiscounts = async () => {
    try {
      const response = await fetch(`${API_URL}/api/v1/books/discounts`);
      if (response.ok) {
        const data = await response.json();
        setDiscounts(data.data);
        console.error('discount data:', data.data);

      } else {
        console.error('Error fetching discounts:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching discounts:', error);
    }
  };

  return { discounts, fetchDiscounts };
};

export const useAddDiscount = () => {
  const addDiscount = async (payload) => {
    try {
      const response = await fetch(`${API_URL}/api/v1/discounts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error('Failed to add discount');
      }
    } catch (error) {
      console.error('Error adding discount:', error);
      throw error;
    }
  };

  return { addDiscount };
};

//get all book
export const useGetAllDeleteBook = () =>{
  const [deleteBook, setBooks] = useState([])
  const fetchGetAllDeleteBook = async () => {
      try {
        const tokenString = localStorage.getItem('tokenAdmin')
        const token = JSON.parse(tokenString)
        const response = await fetch(`${API_URL}/api/v1/books/deleted`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token?.accessToken}`, 
          },
        });
        if (response.ok) {
          const book = await response.json()
          setBooks(book.data)
          localStorage.setItem('books',JSON.stringify(book.data))
          console.log('Get data success', book.data)
          return true;
        } else {
          console.log('Error fetching delete books:', response.statusText)
          return false;
        }
      } catch (error) {
        console.log('Error fetching delete books data:', error)
        return false
      }
    }
  
  return  {deleteBook, fetchGetAllDeleteBook}
}

//Restore  book
export const useRestoreBook = () =>{
  const fetchRestoreBook= async (id) => {
    const tokenString = localStorage.getItem('tokenAdmin')
    const token = JSON.parse(tokenString)
    try {
      const response = await fetch(`${API_URL}/api/v1/books/${id}/restore`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token?.accessToken}`, 
        },
      });
      const data = await response.json();
      if (response.ok) {
        console.log('restore data:',data.message)
         return true;
      } else {
        console.error('Error fetching restore book data:', data.data);
        return false;

      }
    } catch (error) {
      console.error('Error fetching restore book data:', error);
      return false;

    } 
  };
  
  return  {fetchRestoreBook}
}

// update cate for admin
export const useDeleteDiscount = () =>{
  const fetchDeleteDiscount = async (id) => {
    const tokenString = localStorage.getItem('tokenAdmin')
    const token = JSON.parse(tokenString)
    try {
      const response = await fetch(`${API_URL}/api/v1/books/${id}/discounts`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token?.accessToken}`, 
        },
      });
      const data = await response.json();
      if (response.ok) {
        console.log('delete  :',data.data)
         return true;
      } else {
        console.error('Error fetching delete data:', data.data);
        return false;

      }
    } catch (error) {
      console.error('Error fetching delete data:', error);
      return false;

    } 
  };
  
  return  {fetchDeleteDiscount}
}

// update cate for admin
export const useAddNotification = () =>{
  const fetchAddNotification = async (title,message) => {
    const tokenString = localStorage.getItem('tokenAdmin')
    const token = JSON.parse(tokenString)
    try {
      const response = await fetch(`${API_URL}/api/v1/notifications/create-for-all`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token?.accessToken}`, 
        },
        body:JSON.stringify({
          title: title,
          message:message,
        })
      });
      const data = await response.json();
      if (response.ok) {
        console.log('notify  :',data.message)
         return true;
      } else {
        console.error('Error fetching notify data:', data.data);
        return false;

      }
    } catch (error) {
      console.error('Error fetching notify data:', error);
      return false;

    } 
  };
  
  return  {fetchAddNotification}
}