exports.getResetPasswordLink = (req, res) => {
  const { token } = req.params;
  console.log(token);

  return res.status(200).render('resetPassword', {
    title: 'Something went wrong!',
    token: token,
  });
};

exports.getHome = (req, res) => res.json({ msg: 'Hello world' });
