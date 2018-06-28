package com.saturn;

import org.apache.commons.lang3.RandomStringUtils;
import org.junit.AfterClass;
import org.junit.BeforeClass;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import java.util.*;
import static org.junit.Assert.*;


public class TestListPasswords {
    private static TestHelper helper;
    private static List<String> expectedColumns;
    private static String siteName;

	@BeforeClass
	public static void setUp() throws Exception {
        helper = new TestHelper();
        initExpectedColumns();
        helper.driver.get(helper.url);
        siteName = "Site"+ RandomStringUtils.randomAlphanumeric(8);
        helper.login();
        helper.createSaturnVaultAccount(siteName);
    }
    
    //List all saturn vault passwords/accounts and test that it isn't empty after we made an account
	@Test
	public void listPasswordsTest(){
        List<List<String>> passwords = helper.listSaturnVaultAccounts();
        assertFalse(passwords.isEmpty());
    }

    //Test that all of the expected columns are shown to the user
    @Test
    public void checkColumnsTest(){
        List<String> columns = helper.getSaturnVaultColumns();
        assertTrue(columns.containsAll(expectedColumns));
    }
    
    private static void initExpectedColumns(){
        expectedColumns = new ArrayList<String>();
        expectedColumns.add("ID");
        expectedColumns.add("Site");
        expectedColumns.add("Login");
        expectedColumns.add("Password");
        expectedColumns.add("Created Date");
        expectedColumns.add("Last Modified Date");
    }
	
	@AfterClass
	public static void tearDown() throws Exception {
        if(helper.isElementPresent(By.cssSelector("#site-" + siteName))){
			helper.deleteSaturnVaultAccount(siteName, false);
		}
        helper.tearDown();
	}
}