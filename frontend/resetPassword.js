const handleSubmit = async (event) => {
  event.preventDefault();

  const data = {
    email: event.target.email.value,
  };

  localStorage.setItem("userEmail", JSON.stringify(data.email));

  try {
    const res = await axios.post(
      "http://localhost:4000/password/forgetPassword",
      data
    );
    //const password = res.data.user.password;
    alert(`Link sent to your mail`);

    window.location.href = "./login.html";

    // console.log(res.data.user.password);
    // alert(`Password is  ${password}`);
  } catch (error) {
    alert(`Some Error Try Again`);
    console.log(error);
  }
  event.target.email.value = "";
};
