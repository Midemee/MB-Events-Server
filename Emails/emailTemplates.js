const createWelcomeEmailTemplate = (fullName, clientUrl) => {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Welcome to Mb Events</title>
  </head>
  <body
    style="
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    "
  >
    <main style="background-color: #9747ff0f">
      <div
        style="
          background-color: #9747ff;
          padding: 30px;
          text-align: center;
          border-radius: 10px 10px 0 0;
        "
      >
        <img
          src="https://res.cloudinary.com/dlb8nbz13/image/upload/v1731960043/logo_fxpodu.png"
          alt="Mb events Logo"
          style="
            max-width: 50.3px;
            max-height: 43.92px;
            margin-bottom: 20px;
            border-radius: 5px;
          "
        />

        <h1 style="color: white; margin: 0; font-size: 28px">
          Welcome to Mb Events!
        </h1>
      </div>
      <div
        style="
          background-color: #ffffff;
          padding: 30px;
          border-radius: 0 0 10px 10px;
        "
      >
        <p style="font-size: 18px; color: #9747ff">
          <strong>Hello ${fullName},</strong>
        </p>
        <p>We're thrilled to have you join us!</p>

        <div style="text-align: start; margin: 30px 0">
          <a
            href="${clientUrl}"
            style="
              background-color: #9747ff;
              color: white;
              padding: 14px 38px;
              text-decoration: none;
              border-radius: 10px;
              font-weight: bold;
              font-size: 16px;
              transition: background-color 0.3s;
            "
            >log in</a
          >
        </div>
        <p>
          If you have any questions or need assistance, our support team is
          always here to help.
        </p>
        <p>Best regards,<br />Mb Events Team</p>
      </div>
    </main>
  </body>
</html>
`;
};

const newsLetterTemplate = ()=> {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>MB Events Newsletter</title>
  </head>
  <body
    style="
      margin: 0;
      padding: 0;
      background-color: #f4f6f8;
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333333;
    "
  >
    <main style="max-width: 600px; margin: 0 auto; background-color: #9747ff0f;">
      <div
        style="
          background-color: #9747ff;
          padding: 30px;
          text-align: center;
          border-radius: 10px 10px 0 0;
        "
      >
        <img
          src="https://res.cloudinary.com/dlb8nbz13/image/upload/v1731960043/logo_fxpodu.png"
          alt="Mb Events Logo"
          style="
            max-width: 50px;
            max-height: 44px;
            margin-bottom: 20px;
            border-radius: 5px;
          "
        />
        <p style="color: #f9f9f9; margin-top: 8px; font-size: 14px;">
          Discover events, offers, and exclusive insights
        </p>
      </div>
      <div
        style="
          background-color: #ffffff;
          padding: 30px;
          border-radius: 0 0 10px 10px;
        "
      >

        <p style="margin: 0 0 16px;">
          We’ve got something exciting lined up for you! By subscribing to our
          newsletter, you’ll get:
        </p>

        <ul style="margin: 0 0 24px; padding-left: 20px; color: #374151; font-size: 14px;">
          <li style="margin-bottom: 10px;">Fresh updates straight to your inbox</li>
          <li style="margin-bottom: 10px;">Exclusive content & early access</li>
          <li style="margin-bottom: 10px;">Insider tips, trends, and special offers</li>
        </ul>

        <p style="margin: 0 0 16px;">
          No spam. Just value — delivered consistently.  
        </p>

        <p style="margin: 0;">
          We can’t wait to have you with us.<br />
          Stay connected,<br />
          <strong>Mb Events Team</strong>
        </p>
      </div>
      <div
        style="
          text-align: center;
          font-size: 12px;
          color: #6b7280;
          padding: 16px 10px;
        "
      >
        <p style="margin: 0;">
          You’re receiving this because you showed interest in
          <strong>MB Events</strong>.
        </p>
        <p style="margin: 6px 0 0;">
          <a
            href="[UNSUBSCRIBE_LINK]"
            style="color: #9747ff; text-decoration: underline;"
            target="_blank"
            >Unsubscribe anytime</a
          >
        </p>
      </div>
    </main>
  </body>
</html>`
}

const createResetEmailTemplate = (resetLink) => {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Reset password</title>
  </head>
  <body
    style="
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    "
  >
    <div
      style="
        background-color: #9747ff;
        padding: 30px;
        text-align: center;
        border-radius: 10px 10px 0 0;
      "
    >
      <img
        src="https://res.cloudinary.com/dlb8nbz13/image/upload/v1731960043/logo_fxpodu.png"
        alt="Mb events Logo"
        style="
          max-width: 50.3px;
          max-height: 43.92px;
          margin-bottom: 20px;
          border-radius: 5px;
        "
      />

      <h1 style="color: white; margin: 0; font-size: 28px">Reset password!</h1>
    </div>
    <div
      style="
        background-color: #ffffff;
        padding: 30px;
        border-radius: 0 0 10px 10px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      "
    >

      <p style= "font-size : 15px; font-weight: 800"> Forgot your password?</p>
      <div
        style="
          background-color: #f3f6f8;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
        "
      >
        <h1>You have requested for a password reset from MB events</h1>
        <p>Please go to this link to reset password</p>
        <a href="${resetLink}" clicktracking="off">Click To Reset</a>
      </div>

      <p>
        If you have any questions or need assistance, our support team is always
        here to help.
      </p>
      <p>Best regards,<br />The Mb Events Team</p>
    </div>
  </body>
</html>
`;
};

module.exports ={ createWelcomeEmailTemplate, newsLetterTemplate, createResetEmailTemplate };