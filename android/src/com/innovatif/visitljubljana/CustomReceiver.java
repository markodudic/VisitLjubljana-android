package com.innovatif.visitljubljana;

import android.content.BroadcastReceiver;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ActivityInfo;
import android.content.pm.PackageManager;
import android.content.pm.PackageManager.NameNotFoundException;
import android.os.Bundle;

import com.google.analytics.tracking.android.CampaignTrackingReceiver;
import com.mobpartner.android.advertiser.MobPartnerUtils;

/*
 *  A simple Broadcast Receiver to receive an INSTALL_REFERRER
 *  intent and pass it to other receivers, including
 *  the Google Analytics receiver.
 */
public class CustomReceiver extends BroadcastReceiver {

  @Override
  public void onReceive(Context context, Intent intent) {
	System.out.println("GA Campanja onReceive");

    // Pass the intent to other receivers.
	//MobPartner
	ActivityInfo ai;
	try { 
		ai = context.getPackageManager().getReceiverInfo(new ComponentName(context, "com.innovatif.visitljubljana.CustomReceiver"), PackageManager.GET_META_DATA); 
		Bundle extras = intent.getExtras(); 
		String referrerString = extras.getString("referrer"); 
		System.out.println("GA Referrer is: " + referrerString+":"+context.getString(R.string.mobpartner_cid)+":"+context.getString(R.string.mobpartner_caid)); 
		if (referrerString.contains("mobpartner")) { 
			extras.putString(MobPartnerUtils.META_CID, context.getString(R.string.mobpartner_cid)); 
			extras.putString(MobPartnerUtils.META_CAID, context.getString(R.string.mobpartner_caid)); 
			intent.putExtras(extras);
			try { 
				((BroadcastReceiver) Class.forName( "com.mobpartner.android.advertiser.MobPartnerAdvertiserReceiver").newInstance()).onReceive(context, intent); 
				} catch (IllegalAccessException e) { e.printStackTrace(); 
				} catch (InstantiationException e) { e.printStackTrace(); 
				} catch (ClassNotFoundException e) { e.printStackTrace(); 
			} 
		} 
		} catch (NameNotFoundException e) { 
			// TODO Auto-generated catch block 
			e.printStackTrace(); 
	} 
			  
	//MobPartnerAdvertiser ad = new MobPartnerAdvertiser(context);
	//ad.sendMobPartnerAdInfos(context.getString(R.string.mobpartner_caid), true);
	  
	/*Intent i = new Intent("com.android.vending.INSTALL_REFERRER"); 
	i.setPackage(this.getPackageName()); 
	i.putExtra("referrer", "utm_source%3Dmobpartner%26utm_medium%3DPartner%26utm_campaign%3D118"); 
	sendBroadcast(i);
	*/ 
    // When you're done, pass the intent to the Google Analytics receiver.
    new CampaignTrackingReceiver().onReceive(context, intent);
  }
}