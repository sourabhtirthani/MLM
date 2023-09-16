const {URL} = require("./url");

const message = () => {
   
    return `
    <!doctype html>
    <html lang="en">
    <head> 
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <link rel="icon" type="image/x-icon" href="${URL}/assets/img/fav.png">
      <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Arvo:ital,wght@0,400;0,700;1,400;1,700&family=Nunito:wght@200;300;400;500;600;700;800;900;1000&display=swap" rel="stylesheet">
    
      <title>Registration</title>
    </head>
    <body>
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout:fixed;background-color:#fff" id="bodyTable">
        <tbody>
          <tr>
            <td style="padding-right:10px;padding-left:10px;" align="center" valign="top" id="bodyCell">
    
              <table border="0" cellpadding="0" cellspacing="0" width="100%" class="wrapperBody" style="max-width:500px;margin-top: 10px">
                <tbody>
                  <tr>
                    <td align="center" valign="top">
                      <table border="0" cellpadding="0" cellspacing="0" width="100%" class="tableCard" style="background-color: #E4082D; border-color: #e5e5e5;
                                       border-style: solid; box-shadow: 0px 0px 10px #d3cdcd; border-radius: 5px;  padding: 15px;">
                        <tbody> 
                          <tr style="">
                            <td style="padding-bottom: 10px;" align="center" valign="middle" class="emailLogo">
                             <!--  <h4 class="text" style="color:#fff;font-family:Poppins,Helvetica,Arial,sans-serif;font-size:30px; font-family: 'roboto'; font-weight:600;font-style:normal;letter-spacing:1px;line-height:24px;text-transform:none;text-align:center;padding:0;margin:0">Otp Verification</h4> -->
                              <a href="javascript:void()" style="text-decoration:none">
                                <img alt="" border="0" src="${URL}/assets/img/reg.png" style="width:100%; height:auto;display:block"  >
                              </a>
                            </td>
                          </tr> 
                          <tr>
                            <td style="padding-top: 20px;padding-bottom: 10px; padding-left: 15px; padding-right: 20px; text-align: center;"  valign="top" class="subTitle">
                              <h4 class="text" style=" color:#fff;font-family:'Nunito';font-size:25px;font-weight:700;font-style:normal;letter-spacing:normal;line-height:34px;text-transform:none;text-align:center;padding:0;margin:0">Thank you for Registration on our website, Welcome to the MiPay wallet family. </h4>
                            </td>
                          </tr>                         
                          <tr>
                            <td style="padding-top: 0px;padding-bottom: 10px; padding-left: 15px; padding-right: 20px; text-align: left;"  valign="top" class="subTitle">
                              <h6 class="text" style=" color:#fff;font-family:'Nunito';font-size:16px;font-weight:400;font-style:normal;letter-spacing:normal;line-height:24px;text-transform:none;text-align:center;padding:0;margin:0">
                                Complete your KYC to use all features of the application!
                               </h6>
                            </td>
                          </tr>
                          
                             <tr>
                            <td style="padding-top: 10px;padding-bottom: 10px;"  valign="top" class="subTitle">
                               <hr>
                            </td>
                          </tr>
    
                          <tr>
                            <td style="padding-top: 20px;padding-bottom: 10px; padding-left: 15px; padding-right: 20px; text-align: center;"  valign="top" class="subTitle">
                              <h4 class="text" style=" color:#fff;font-family:'Nunito';font-size:25px;font-weight:bold;font-style:normal;letter-spacing:normal;line-height:24px;text-transform:none;text-align:center;padding:0;margin:0">Warm Regards
                              </h4>
                            </td>
                          </tr>
                          
                          <tr>
                            <td style="padding-top: 0px;padding-bottom: 0px; padding-left: 15px; padding-right: 20px; text-align: left;"  valign="top" class="subTitle">
                              <h4 class="text" style="margin-left: 15px; color:#fff;font-family:'Nunito';font-size:18px;font-weight:600;font-style:normal;letter-spacing:0px;line-height:24px;text-transform:none;text-align:center;padding:0;margin:0">
                                <img alt="" border="0" src="${URL}/assets/img/white_logo.png" style="max-width:80px; display:block; margin: 0 auto"> 
                              &nbsp;  </h4>
                            </td>
                          </tr>    
                        </tbody>
                      </table> 
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </body>
    </html>    
    `;
}
module.exports = {message};