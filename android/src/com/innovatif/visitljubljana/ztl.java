/*
       Licensed to the Apache Software Foundation (ASF) under one
       or more contributor license agreements.  See the NOTICE file
       distributed with this work for additional information
       regarding copyright ownership.  The ASF licenses this file
       to you under the Apache License, Version 2.0 (the
       "License"); you may not use this file except in compliance
       with the License.  You may obtain a copy of the License at

         http://www.apache.org/licenses/LICENSE-2.0

       Unless required by applicable law or agreed to in writing,
       software distributed under the License is distributed on an
       "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
       KIND, either express or implied.  See the License for the
       specific language governing permissions and limitations
       under the License.
 */

package com.innovatif.visitljubljana;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

import org.apache.cordova.Config;
import org.apache.cordova.DroidGap;

import android.content.Context;
import android.content.SharedPreferences.Editor;
import android.os.Bundle;

import com.google.analytics.tracking.android.EasyTracker;
import com.mobpartner.android.advertiser.MobPartnerAdvertiser;

public class ztl extends DroidGap
{
    @Override
    public void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        super.setIntegerProperty("splashscreen", R.drawable.splash);
        super.loadUrl(Config.getStartUrl(), 3000);
        
        appView.setVerticalScrollBarEnabled(false);
        appView.setHorizontalScrollBarEnabled(false);
       
        MobPartnerAdvertiser ad = new MobPartnerAdvertiser(this);
        ad.sendMobPartnerAdInfos(getString(R.string.mobpartner_caid), true);
               
        /*Intent i = new Intent("com.innovatif.visitljubljana.INSTALL_REFERRER"); 
        i.setPackage(this.getPackageName()); 
        i.putExtra("referrer", "utm_source=mobpartner%26utm_medium%3DPartner%26utm_campaign%3D118"); 
        //i.putExtra("referrer", "utm_source=adplatform&utm_medium=cpc&utm_content=android_slo_cpc&utm_campaign=vljapp_htpl");
        sendBroadcast(i);
        */
        //analytics
        EasyTracker.getInstance().setContext(this);
        EasyTracker.getInstance().activityStart(this); // Add this method.
        
        //skopiram predpripravljeno bazo        
        try
        {
        	String pName = this.getClass().getPackage().getName();
        	String dName = "/data/data/"+pName+"/databases/";
        	String dbName = "Database_3.db";
        	
        	File f = new File(dName+dbName);
        	System.out.println("DATABASE EXISTS="+f.exists());
        	if(!f.exists()) {
        		System.out.println("COPY DATABASE="+dName+dbName);
            	copy(dbName,dName);
        	}
	    }
	        catch (IOException e)
	    {
	     e.printStackTrace();
	    }
	    
    }
   
    //Copy Paste this function in the class where you used above part
	void copy(String file, String folder) throws IOException 
	{
	
	 File CheckDirectory;
	 CheckDirectory = new File(folder);
	 if (!CheckDirectory.exists())
	 { 
		 CheckDirectory.mkdir();
	 }
	 	InputStream in = getApplicationContext().getAssets().open(file);
	    OutputStream out = new FileOutputStream(folder+file);
	
	    // Transfer bytes from in to out
	    byte[] buf = new byte[1024];
	    int len; while ((len = in.read(buf)) > 0) out.write(buf, 0, len);
	    in.close(); out.close();
	}

}