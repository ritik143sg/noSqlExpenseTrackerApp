const result = document.getElementById("result");

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
    //alert(`Link sent to your mail`);

    result.innerText = "Link sent to your mail";

    result.style.color = "green";

    setTimeout(() => {
      window.location.href = "./login.html";
    }, 2000);

    // console.log(res.data.user.password);
    // alert(`Password is  ${password}`);
  } catch (error) {
    //alert(`Some Error Try Again`);
    result.innerText = "Some Error Try Again";

    result.style.color = "red";

    console.log(error);
  }
  event.target.email.value = "";
};
