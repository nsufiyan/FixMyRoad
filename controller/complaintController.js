const { ComplaintModel, UserModel } = require("../model");
const { sendEmail } = require("../utils/sendEmail");

const addComplaint = async (req, res, next) => {
  try {

    req.body.user = req.session.user._id;
    await UserModel.findOneAndUpdate(
      { _id: req.session.user._id },
      { points: req.session.user.points + 1 }
    ).exec();
    req.session.user.points = req.session.user.points + 1;
    req.body.url = `${process.env.BASE_URL}/${req.file.originalname}`;
    const savedComplaintData = await ComplaintModel.create(req.body);
    res.json({
      success: true,
      message: "Complaint Registered Successfully",
      data: savedComplaintData,
    });
    await sendEmail({
      to: [process.env.ADMIN_EMAIL, req.session.user.email].join(", "),
      subject: `🚧 New Pothole Complaint Registered | Complaint ID: ${savedComplaintData?._id}`,

      text: `Hello,

    A new pothole complaint has been successfully registered.

    Complaint Details:
    - Complaint ID: ${savedComplaintData?._id}
    - Reported By: ${req.session?.user?.name ?? "N/A"}
    - Location (Lat, Long): (${req.body.latitude}, ${req.body.longitude})
    - Date & Time: ${new Date().toLocaleString()}
    - Image: ${req.body.url}

    Map Location:
    https://www.google.com/maps/?q=${req.body.latitude},${req.body.longitude}

    Our team will review this complaint shortly.

    Thank you,
    Team FixMyRoad
    `,

      html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2 style="color:#2E86C1;">🚧 New Pothole Complaint Registered</h2>

        <p>Hello,</p>
        <p>A new pothole complaint has been successfully registered. Below are the details:</p>

        <h3 style="margin-top:20px;">Complaint Details</h3>
        <ul>
          <li><strong>Complaint ID:</strong> ${savedComplaintData?._id}</li>
          <li><strong>Reported By:</strong> ${req.session?.user?.name ?? "N/A"}</li>
          <li><strong>Location:</strong> (${req.body.latitude}, ${req.body.longitude})</li>
          <li><strong>Date & Time:</strong> ${new Date().toLocaleString()}</li>
         <li>
          <strong>Image:</strong>
          <a href="${req.body.url}" target="_blank"
            style="color:#1A73E8; font-weight:600;">
             view image
          </a>
        </li>

        </ul>

        <p>
          <strong>Map Location:</strong><br>
          <a href="https://www.google.com/maps/?q=${req.body.latitude},${req.body.longitude}" 
             style="color:#1A73E8;" target="_blank">
             View on Google Maps
          </a>
        </p>

        <p>Our team will review this complaint shortly.</p>

        <p style="margin-top:30px;">Thank you,<br>
        <strong>Team FixMyRoad</strong></p>
      </div>
      `,
    });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const getComplaint = async (req, res, next) => {
  try {
    let complaintData = await ComplaintModel.find(req.query).populate({
      path: "user",
      model: "user",
      select: "points",
    }).exec();
    res.json({
      success: true,
      message: "Complainted fetched successfully",
      data: complaintData,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

const updateComplaint = async (req, res, next) => {
  try {
    req.session.user.points = req.session.user.points + 1;
    await UserModel.findOneAndUpdate(
      { _id: req.session.user._id },
      { points: req.session.user.points + 1 }
    ).exec();
    req.body.resolvedUrl = `${process.env.BASE_URL}/${req.file.originalname}`;

    let updateData = await ComplaintModel.findOneAndUpdate(req.query, req.body, {
      new: true,
    }).populate({
      path: "user",
      model: "user",
      select: "name email",
    }).exec();

    res.json({
      success: true,
      message: "Complaint Resolved Successfully",
      data: updateData,
    });

    await sendEmail({
      to: [process.env.ADMIN_EMAIL, updateData.user.email].join(", "),
      subject: `✅ Pothole Complaint Resolved | Complaint ID: ${updateData?._id}`,

      text: `Hello,

    Good news! Your pothole complaint has been successfully resolved.

    Complaint Details:
    - Complaint ID: ${updateData?._id}
    - Resolved By: ${req.session?.user?.name ?? "N/A"}
    - Location (Lat, Long): (${updateData.latitude}, ${updateData.longitude})
    - Date & Time: ${new Date().toLocaleString()}
    - Before Image: ${updateData.url}
    - After Image: ${updateData.resolvedUrl}

    Map Location:
    https://www.google.com/maps/?q=${updateData.latitude},${updateData.longitude}

    Thank you for helping improve road safety.

    Regards,
    Team FixMyRoad
    `,

      html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2 style="color:#28a745;">✅ Pothole Complaint Resolved</h2>

        <p>Hello,</p>
        <p>Good news! Your pothole complaint has been successfully resolved. Here are the details:</p>

        <h3 style="margin-top:20px;">Resolution Details</h3>
        <ul>
          <li><strong>Complaint ID:</strong> ${updateData?._id}</li>
          <li><strong>Resolved By:</strong> ${req.session?.user?.name ?? "N/A"}</li>
          <li><strong>Location:</strong> (${updateData.latitude}, ${updateData.longitude})</li>
          <li><strong>Date & Time:</strong> ${new Date().toLocaleString()}</li>
          <li>
              <strong>Before Image:</strong>
              <a href="${updateData.url}" target="_blank"
                style="color:#1A73E8; font-weight:600;">
                view before image
              </a>
            </li>

            <li>
              <strong>After Image:</strong>
              <a href="${updateData.resolvedUrl}" target="_blank"
                style="color:#1A73E8; font-weight:600;">
               View after image
              </a>
            </li>

        </ul>

        <p>
          <strong>Map Location:</strong><br>
          <a href="https://www.google.com/maps/?q=${updateData.latitude},${updateData.longitude}" 
             style="color:#1A73E8;" target="_blank">
             View on Google Maps
          </a>
        </p>

        <p>Thank you for helping improve road safety.</p>

        <p style="margin-top:30px;">Regards,<br>
        <strong>Team FixMyRoad</strong></p>
      </div>
      `,
    });


  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const rejectComplaint = async (req, res, next) => {
  try {
    let updateData = await ComplaintModel.findOneAndUpdate(req.query, req.body, {
      new: true,
    }).populate({
      path: "user",
      model: "user",
      select: "name email",
    }).exec();
    res.json({
      success: true,
      message: "Complaint Rejected Successfully",
      data: updateData,
    });
    await sendEmail({
      to: [process.env.ADMIN_EMAIL, updateData.user.email].join(", "),
      subject: `❌ Pothole Complaint Rejected | Complaint ID: ${updateData?._id}`,

      text: `Hello,

    Your pothole complaint has been reviewed but unfortunately it has been rejected.

    Complaint Details:
    - Complaint ID: ${updateData?._id}
    - Reviewed By: ${req.session?.user?.name ?? "N/A"}
    - Location (Lat, Long): (${updateData.latitude}, ${updateData.longitude})
    - Date & Time: ${new Date().toLocaleString()}
    - Image Submitted: ${updateData?.url}


    Map Location:
    https://www.google.com/maps/?q=${updateData.latitude},${updateData.longitude}

    If you believe this is an error or want to provide more details, feel free to submit the complaint again.

    Thank you,
    Team FixMyRoad
    `,

      html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2 style="color:#d9534f;">❌ Pothole Complaint Rejected</h2>

        <p>Hello,</p>
        <p>Your pothole complaint has been reviewed, but unfortunately it has been rejected. Below are the details:</p>

        <h3 style="margin-top:20px;">Complaint Details</h3>
        <ul>
          <li><strong>Complaint ID:</strong> ${updateData?._id}</li>
          <li><strong>Reviewed By:</strong> ${req.session?.user?.name ?? "N/A"}</li>
          <li><strong>Location:</strong> (${updateData.latitude}, ${updateData.longitude})</li>
          <li><strong>Date & Time:</strong> ${new Date().toLocaleString()}</li>
          <li>
          <strong>Image:</strong>
          <a href="${updateData.url}" target="_blank"
            style="color:#1A73E8; font-weight:600;">
             view image
          </a>
        </li>
        </ul>



        <p>
          <strong>Map Location:</strong><br>
          <a href="https://www.google.com/maps/?q=${updateData.latitude},${updateData.longitude}" 
             style="color:#1A73E8;" target="_blank">
             View on Google Maps
          </a>
        </p>

        <p>If you believe this was a mistake or want to provide more information, you may submit the complaint again.</p>

        <p style="margin-top:30px;">Thank you,<br>
        <strong>Team FixMyRoad</strong></p>
      </div>
      `,
    });





  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const deleteComplaint = async (req, res, next) => {
  try {
    let deletedData = await ComplaintModel.findOneAndDelete(req.query).exec();
    res.json({
      success: true,
      message: "Complaint Deleted Successfully",
      data: deletedData,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

const followupComplaint = async (req, res, next) => {
  try {
    let { complainId } = req.query;
    const complaintData = await ComplaintModel.findById(complainId)
      .populate([
        {
          path: "user",
          model: "user",
          select: "name email",
        },
      ])
      .exec();
    res.json({
      success: true,
      message: "Complaint Followed Up Successfully",
      data: complaintData,
    });
    await sendEmail({
      to: [process.env.ADMIN_EMAIL, req.session.user.email].join(", "),
      subject: `📨 Follow-Up on Pothole Complaint | Complaint ID: ${complaintData?._id}`,

      text: `Hello,

    This is a follow-up regarding the pothole complaint submitted.

    Complaint Details:
    - Complaint ID: ${complaintData?._id}
    - Reported By: ${req.session?.user?.name ?? "N/A"}
    - Location (Lat, Long): (${complaintData?.latitude}, ${complaintData?.longitude})
    - Date & Time of Submission: ${new Date(complaintData?.createdAt).toLocaleString()}
    - Image Submitted: ${complaintData?.url}



    Map Location:
    https://www.google.com/maps/?q=${complaintData?.latitude},${complaintData?.longitude}

    If you have additional details, you may reply to this email or update your complaint.

    Thank you,
    Team FixMyRoad
    `,

      html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2 style="color:#2E86C1;">📨 Follow-Up on Pothole Complaint</h2>

        <!-- LOGO SPACE -->
        <div style="width:120px; height:60px; background:#eee; margin:15px 0;">
          <!-- Add your logo here -->
        </div>

        <p>Hello,</p>
        <p>This is a follow-up regarding the submitted pothole complaint. Below are the details:</p>

        <h3 style="margin-top:20px;">Complaint Details</h3>
        <ul>
          <li><strong>Complaint ID:</strong> ${complaintData?._id}</li>
          <li><strong>Reported By:</strong> ${req.session?.user?.name ?? "N/A"}</li>
          <li><strong>Location:</strong> (${complaintData?.latitude}, ${complaintData?.longitude})</li>
          <li><strong>Date & Time of Submission:</strong> ${new Date(complaintData?.createdAt).toLocaleString()}</li>
          <li><strong>Image Submitted:</strong> <a href="${complaintData?.url}" target="_blank">View Image</a></li>
        </ul>


        <p>
          <strong>Map Location:</strong><br>
          <a href="https://www.google.com/maps/?q=${complaintData?.latitude},${complaintData?.longitude}" 
             style="color:#1A73E8;" target="_blank">
             View on Google Maps
          </a>
        </p>

        <p>If you would like to provide additional details or clarify anything, feel free to reply to this email.</p>

        <p style="margin-top:30px;">Thank you,<br>
        <strong>Team FixMyRoad</strong></p>
      </div>
      `,
    });


  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  addComplaint,
  getComplaint,
  updateComplaint,
  deleteComplaint,
  followupComplaint,
  rejectComplaint,
};
