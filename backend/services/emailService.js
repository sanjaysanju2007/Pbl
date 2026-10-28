const nodemailer = require('nodemailer');

// Helper to check if SMTP credentials are fully provided
const isSmtpConfigured = () => {
  return (
    process.env.SMTP_HOST &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS &&
    !process.env.SMTP_USER.includes('your_email') &&
    !process.env.SMTP_PASS.includes('your_app_password')
  );
};

// Create reusable transporter
const createTransporter = () => {
  if (!isSmtpConfigured()) return null;

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10) || 587,
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

/**
 * Send admission acknowledgment to parent
 */
const sendAdmissionAcknowledgment = async (admission) => {
  const appNo = admission.applicationNumber || 'PENDING';
  const child = admission.childName;
  const program = admission.program;
  const parentName = admission.primaryContactName || admission.fatherName || admission.motherName || 'Parent / Guardian';

  console.log(`\n======================================================`);
  console.log(`📧 [EMAIL SERVICE] Preparing Parent Acknowledgement`);
  console.log(`   To: ${admission.guardianEmail}`);
  console.log(`   Application No: ${appNo}`);
  console.log(`   Student: ${child} (${program})`);
  console.log(`======================================================\n`);

  if (!isSmtpConfigured()) {
    console.log(`ℹ️ [EMAIL SERVICE] SMTP credentials not set in .env. Email simulated in development mode.`);
    return { success: true, simulated: true };
  }

  try {
    const transporter = createTransporter();
    const mailOptions = {
      from: `"${process.env.FROM_NAME || 'Chittukurumbakam Play School'}" <${process.env.FROM_EMAIL || 'noreply@chittukurumbakam.com'}>`,
      to: admission.guardianEmail,
      subject: `Application Received (${appNo}) — ${child} | Chittukurumbakam Play School`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #fdfbf7; margin: 0; padding: 20px; color: #1e293b; }
            .card { max-width: 620px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.06); border: 1px solid #f1f5f9; }
            .header { background: linear-gradient(135deg, #1d4ed8, #0d9488); padding: 36px 30px; text-align: center; color: #ffffff; }
            .header h1 { margin: 0 0 6px 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; }
            .header p { margin: 0; font-size: 14px; opacity: 0.9; }
            .badge { display: inline-block; background: #fef3c7; color: #b45309; padding: 6px 14px; border-radius: 9999px; font-weight: 700; font-size: 13px; margin-top: 14px; }
            .body { padding: 32px 30px; }
            .greeting { font-size: 18px; font-weight: 700; color: #0f172a; margin-top: 0; }
            .info-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 20px; margin: 24px 0; border-left: 5px solid #2563eb; }
            .info-row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px dashed #e2e8f0; font-size: 14px; }
            .info-row:last-child { border-bottom: none; }
            .info-label { color: #64748b; font-weight: 600; }
            .info-val { color: #0f172a; font-weight: 700; }
            .notice-box { background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 12px; padding: 14px 18px; color: #065f46; font-size: 13px; line-height: 1.6; margin: 20px 0; }
            .footer { background: #f8fafc; padding: 20px 30px; text-align: center; color: #94a3b8; font-size: 12px; border-top: 1px solid #f1f5f9; }
            .footer a { color: #2563eb; text-decoration: none; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="header">
              <h1>🌈 Chittukurumbakam Play School</h1>
              <p>Where Every Child Blossoms with Joy & Wonder</p>
              <span class="badge">Application Ref: ${appNo}</span>
            </div>
            <div class="body">
              <h2 class="greeting">Dear ${parentName},</h2>
              <p style="line-height: 1.7; color: #475569; font-size: 15px;">
                Thank you for applying for admission to <strong>Chittukurumbakam Play School</strong>! 
                We have safely received your formal admission enquiry application for <strong>${child}</strong>.
              </p>

              <div class="info-box">
                <div class="info-row">
                  <span class="info-label">Application Number:</span>
                  <span class="info-val">${appNo}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Student Name:</span>
                  <span class="info-val">${child}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Applying For:</span>
                  <span class="info-val">${program} (${admission.academicYear || '2025-2026'})</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Submission Date:</span>
                  <span class="info-val">${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Current Status:</span>
                  <span class="info-val" style="color: #2563eb;">Submitted (Under Review)</span>
                </div>
              </div>

              <div class="notice-box">
                ℹ️ <strong>Please Note:</strong> This acknowledgement confirms receipt of your application for review. Formal admission confirmation is subject to our age criteria, seat availability, and mentor interaction.
              </div>

              <p style="line-height: 1.7; color: #475569; font-size: 15px;">
                Our admissions committee will review your application within <strong>2 to 3 business days</strong> and connect with you via your preferred contact method.
              </p>

              <p style="margin-top: 28px; line-height: 1.6; color: #334155; font-size: 14px;">
                Warm regards,<br>
                <strong>Admissions Team</strong><br>
                Chittukurumbakam Play School, Tiruppur<br>
                📞 +91 99522 85838 | ✉️ info@chittukurumbakam.com
              </p>
            </div>
            <div class="footer">
              Chittukurumbakam Play School • Dharapuram - Tiruppur Rd, Tiruppur, Tamil Nadu 641604<br>
              This is an automated system email. Please keep your Application Number (${appNo}) for tracking.
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Admission acknowledgment email sent to ${admission.guardianEmail}`);
    return { success: true };
  } catch (error) {
    console.error(`❌ Email send failed to ${admission.guardianEmail}: ${error.message}`);
    return { success: false, error: error.message };
  }
};

/**
 * Send admin notification email
 */
const sendAdminNotification = async (type, data) => {
  const adminEmail = process.env.ADMIN_ALERT_EMAIL || process.env.SMTP_USER || 'admin@chittukurumbakam.com';
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const appNo = data.applicationNumber || 'N/A';

  console.log(`\n======================================================`);
  console.log(`🔔 [ADMIN ALERT] New ${type === 'admission' ? 'Admission' : 'Enquiry'} Submitted`);
  console.log(`   Notification Target: ${adminEmail}`);
  console.log(`   Ref: ${appNo}`);
  console.log(`======================================================\n`);

  if (!isSmtpConfigured()) {
    console.log(`ℹ️ [EMAIL SERVICE] SMTP not configured. Admin alert simulated in development.`);
    return { success: true, simulated: true };
  }

  try {
    const transporter = createTransporter();
    const isAdmission = type === 'admission';

    const subject = isAdmission
      ? `🚨 New Admission Application: ${data.childName} (${data.program}) [${appNo}]`
      : `💬 New Enquiry from ${data.name} [${data.subject || 'General'}]`;

    const reviewUrl = isAdmission
      ? `${clientUrl}/admin/admissions`
      : `${clientUrl}/admin/enquiries`;

    const mailOptions = {
      from: `"${process.env.FROM_NAME || 'Chittukurumbakam System'}" <${process.env.FROM_EMAIL || 'noreply@chittukurumbakam.com'}>`,
      to: adminEmail,
      subject,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; color: #1e293b; }
            .card { max-width: 620px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 1px solid #e2e8f0; }
            .header { background: #0f172a; padding: 24px 30px; color: #ffffff; }
            .header h2 { margin: 0; font-size: 18px; font-weight: 700; color: #f8fafc; }
            .body { padding: 28px 30px; }
            .table { width: 100%; border-collapse: collapse; margin: 18px 0; font-size: 14px; }
            .table td { padding: 8px 12px; border-bottom: 1px solid #f1f5f9; }
            .table td:first-child { width: 35%; color: #64748b; font-weight: 600; }
            .table td:last-child { color: #0f172a; font-weight: 700; }
            .btn { display: inline-block; background: #2563eb; color: #ffffff !important; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 14px; margin-top: 16px; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="header">
              <h2>🏫 Chittukurumbakam Admin Alert</h2>
            </div>
            <div class="body">
              <p>A new <strong>${isAdmission ? 'Admission Application' : 'Parent Enquiry'}</strong> has just been submitted on the portal.</p>
              
              <table class="table">
                ${isAdmission ? `
                  <tr><td>Application No:</td><td>${appNo}</td></tr>
                  <tr><td>Child Name:</td><td>${data.childName}</td></tr>
                  <tr><td>Program:</td><td>${data.program}</td></tr>
                  <tr><td>Parent Name:</td><td>${data.primaryContactName || data.fatherName || data.motherName}</td></tr>
                  <tr><td>Primary Phone:</td><td><a href="tel:${data.guardianPhone}">${data.guardianPhone}</a></td></tr>
                  <tr><td>Email:</td><td><a href="mailto:${data.guardianEmail}">${data.guardianEmail}</a></td></tr>
                  <tr><td>Address:</td><td>${data.address || 'N/A'}, ${data.city || 'Tiruppur'}</td></tr>
                  <tr><td>Submission Time:</td><td>${new Date().toLocaleString('en-IN')}</td></tr>
                ` : `
                  <tr><td>Name:</td><td>${data.name}</td></tr>
                  <tr><td>Phone:</td><td><a href="tel:${data.phone}">${data.phone}</a></td></tr>
                  <tr><td>Email:</td><td><a href="mailto:${data.email}">${data.email}</a></td></tr>
                  <tr><td>Message:</td><td>${data.message}</td></tr>
                  <tr><td>Submission Time:</td><td>${new Date().toLocaleString('en-IN')}</td></tr>
                `}
              </table>

              <a href="${reviewUrl}" class="btn">Open Admin Dashboard to Review →</a>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Admin notification sent to ${adminEmail}`);
    return { success: true };
  } catch (error) {
    console.error(`❌ Admin notification email error: ${error.message}`);
    return { success: false, error: error.message };
  }
};

/**
 * Send enquiry confirmation to parent
 */
const sendEnquiryConfirmation = async (enquiry) => {
  if (!isSmtpConfigured()) {
    console.log(`ℹ️ [EMAIL SERVICE] Enquiry acknowledgement simulated for ${enquiry.email}`);
    return { success: true, simulated: true };
  }

  try {
    const transporter = createTransporter();
    const mailOptions = {
      from: `"${process.env.FROM_NAME || 'Chittukurumbakam Play School'}" <${process.env.FROM_EMAIL || 'noreply@chittukurumbakam.com'}>`,
      to: enquiry.email,
      subject: `We Received Your Enquiry | Chittukurumbakam Play School`,
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; padding: 30px;">
          <h2 style="color: #1e3a8a; margin-top: 0;">Hello ${enquiry.name},</h2>
          <p style="color: #475569; line-height: 1.7; font-size: 15px;">
            Thank you for reaching out to <strong>Chittukurumbakam Play School</strong>! 
            We have received your enquiry and our admissions counselor will get in touch with you within 24 to 48 hours.
          </p>
          <div style="background: #f8fafc; border-radius: 12px; padding: 18px; margin: 20px 0; border-left: 4px solid #f59e0b;">
            <p style="margin: 0; color: #64748b; font-size: 13px;"><strong>Your Enquiry Message:</strong></p>
            <p style="margin: 6px 0 0; color: #1e293b; font-style: italic;">"${enquiry.message}"</p>
          </div>
          <p style="color: #475569; line-height: 1.6; font-size: 14px;">
            Warm regards,<br>
            <strong>Chittukurumbakam Play School Team</strong><br>
            📞 +91 99522 85838 | ✉️ info@chittukurumbakam.com
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Enquiry confirmation sent to ${enquiry.email}`);
    return { success: true };
  } catch (error) {
    console.error(`❌ Enquiry email failed: ${error.message}`);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendAdmissionAcknowledgment,
  sendEnquiryConfirmation,
  sendAdminNotification,
  isSmtpConfigured
};
