const { UserModel } = require("../model");
const userModel = require("../model/userModel");
const { sendEmail } = require("../utils/sendEmail");
const addUser = async (req, res, next) => {
  try {
    let userData = await UserModel.create(req.body);
    res.json({
      success: true,
      message: "User registered successfully",
      data: userData,
    });
    await sendEmail({
      to: [process.env.ADMIN_EMAIL, userData.email].join(", "),
      subject: `👋 Welcome to FixMyRoad, ${userData.name}!`,

      text: `Hello ${userData.name ?? "User"},

    Thank you for signing in to FixMyRoad!

    You can now:
    - Report potholes in your area
    - Track the status of your complaints
    - Help improve road safety in your community

    Start reporting now and make your neighborhood safer!

    Thank you,
    Team FixMyRoad
    `,

      html: `
      <div style="font-family: Arial, sans-serif; line-height:1.6;">
        <h2 style="color:#2E86C1;">👋 Welcome to FixMyRoad, ${userData.name ?? "User"}!</h2>

        <p>Hello ${userData.name ?? "User"},</p>

        <p>Thank you for signing in to <strong>FixMyRoad</strong>! You can now:</p>

        <ul>
          <li>Report potholes in your area</li>
          <li>Track the status of your complaints</li>
          <li>Help improve road safety in your community</li>
        </ul>

        <p>Start reporting now and make your neighborhood safer!</p>

        <p style="margin-top:30px;">Thank you,<br>
        <strong>Team FixMyRoad</strong></p>
      </div>
      `,
    });

  } catch (error) {
    if (error.code === 11000) {
      // Get the field that caused the duplicate error
      const duplicateField = Object.keys(error.keyValue)[0];
      res.status(400).json({
        success: false,
        message: `A user with this ${duplicateField} already exists.`,
      });
    } else {
      // Other errors
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

const getUser = async (req, res, next) => {
  try {
    let query = req.query;
    let userData = await UserModel.find(query).exec();
    res.json({
      success: true,
      message: "User read successfully",
      data: userData,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const updateUser = async (req, res, next) => {
  try {
    let query = req.query;
    let updateData = req.body;
    let updateRespose = await UserModel.findOneAndUpdate(query, updateData, {
      new: true,
    }).exec();
    req.session.user = updateRespose;
    res.json({
      success: true,
      message: "Profile Updated Successfully",
      data: updateRespose,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const deleteUser = async (req, res, next) => {
  try {
    let query = req.query;
    let deletedData = await UserModel.findOneAndDelete(query).exec();
    res.json({
      success: true,
      message: "User deleted successfully",
      data: deletedData,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const login = async (req, res, next) => {
  try {
    let phone = req.body.phone;
    let password = req.body.password;
    if (!phone || !password) {
      return res.json({
        success: false,
        message: "Missing Credentials.",
      });
    }
    let userData = await UserModel.findOne(req.body).exec();
    if (userData) {
      req.session.user = userData;

      res.json({
        success: true,
        message: "Logged in successfully.",
        data: userData,
      });
    } else {
      res.json({
        success: false,
        message: "Invalid Credentials.",
      });
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const logout = async (req, res, next) => {
  try {
    res.json({
      success: true,
      message: "You have been logged out successfully.",
      data: await req.session.destroy(),
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


const resetPassword = async (req, res, next) => {
  try {
    const updatedPassword = req.body
    const email = req.query
    const newPassword = await userModel.findOneAndUpdate(email, updatedPassword, {
      new: true,
    }).exec();
    res.json({
      success: true,
      message: "Password Updated Successfully",
      data: newPassword
    })


    await sendEmail({
      to: newPassword.email,
      subject: `🔒 Your FixMyRoad Password Has Been Updated`,

      text: `Hello ${newPassword.name ?? "User"},

Your FixMyRoad account password was successfully updated on ${new Date().toLocaleString()}.

If you made this change, no further action is needed.

If you did NOT update your password, please contact our support team immediately to secure your account.

Stay safe,
Team FixMyRoad
`,

      html: `
  <div style="font-family: Arial, sans-serif; line-height:1.6;">
    <h2 style="color:#2E86C1;">🔒 Password Updated Successfully</h2>

    <p>Hello ${newPassword.name ?? "User"},</p>

    <p>
      Your <strong>FixMyRoad</strong> account password was successfully updated on
      <strong>${new Date().toLocaleString()}</strong>.
    </p>

    <p>If you made this change, no further action is needed.</p>

    <p style="color:#C0392B;">
      If you did <strong>not</strong> update your password, please contact our support team immediately to secure your account.
    </p>

    <p style="margin-top:30px;">Stay safe,<br>
    <strong>Team FixMyRoad</strong></p>
  </div>
  `,
    });





  }
  catch (err) {
    console.log(err)
  }
}


const validateSession = async (req, res, next) => {
  try {
    res.json({
      success: true,
      message: "validated successfully.",
      data: req.session.user,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

module.exports = {
  addUser,
  getUser,
  updateUser,
  deleteUser,
  login,
  logout,
  resetPassword,
  validateSession,

};
