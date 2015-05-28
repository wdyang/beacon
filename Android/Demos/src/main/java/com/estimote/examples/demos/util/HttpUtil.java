package com.estimote.examples.demos.util;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.List;
import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.protocol.HTTP;
public final class HttpUtil {
    /**
     * action for post
     *
     * @param url    server URL
     * @param params send data
     * @return result
     * @throws Exception
     */
    public static String doPost(String url, List<NameValuePair> params)
            throws Exception {
        HttpPost httpPost = new HttpPost(url);
        httpPost.setEntity(new UrlEncodedFormEntity(params, HTTP.UTF_8));
        HttpResponse httpResponse = HttpClientHelper.getHttpClient().execute(
                httpPost);
        StringBuilder sb=new StringBuilder();
        if(httpResponse.getStatusLine().getStatusCode()==200){
            String content;
            BufferedReader reader=new BufferedReader(new InputStreamReader(httpResponse.getEntity().getContent()));
            while((content=reader.readLine())!=null){
                sb.append(content);
            }
        }
        return sb.toString();
    }
    private HttpUtil() {

    }

}
