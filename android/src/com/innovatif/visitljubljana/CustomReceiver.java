package com.innovatif.visitljubljana;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

import com.google.analytics.tracking.android.CampaignTrackingReceiver;
import com.mobpartner.android.advertiser.MobPartnerAdvertiser;

/*
 *  A simple Broadcast Receiver to receive an INSTALL_REFERRER
 *  intent and pass it to other receivers, including
 *  the Google Analytics receiver.
 */
public class CustomReceiver extends BroadcastReceiver {

  @Override
  public void onReceive(Context context, Intent intent) {

    // Pass the intent to other receivers.
	//MobPartner
	MobPartnerAdvertiser ad = new MobPartnerAdvertiser(context);
	ad.sendMobPartnerAdInfos(context.getString(R.string.mobpartner_caid), true);
	  
	/*Intent i = new Intent("com.android.vending.INSTALL_REFERRER"); 
	i.setPackage(this.getPackageName()); 
	i.putExtra("referrer", "utm_source%3Dmobpartner%26utm_medium%3DPartner%26utm_campaign%3D118"); 
	sendBroadcast(i);
	*/

    // When you're done, pass the intent to the Google Analytics receiver.
    new CampaignTrackingReceiver().onReceive(context, intent);
  }
}