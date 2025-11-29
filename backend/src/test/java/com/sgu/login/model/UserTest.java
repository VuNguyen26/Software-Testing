package com.sgu.login.model;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class UserTest {

    @Test
    void testDefaultConstructor() {
        User user = new User();
        assertNotNull(user);
        assertNull(user.getId());
        assertNull(user.getUsername());
        assertNull(user.getPassword());
    }

    @Test
    void testParameterizedConstructor() {
        User user = new User("admin", "password123");
        
        assertNotNull(user);
        assertNull(user.getId()); // ID chưa được set
        assertEquals("admin", user.getUsername());
        assertEquals("password123", user.getPassword());
    }

    @Test
    void testGettersAndSetters() {
        User user = new User();
        
        // Test setters
        user.setId(1L);
        user.setUsername("testuser");
        user.setPassword("testpass");
        
        // Test getters
        assertEquals(1L, user.getId());
        assertEquals("testuser", user.getUsername());
        assertEquals("testpass", user.getPassword());
    }

    @Test
    void testSetId() {
        User user = new User();
        user.setId(999L);
        assertEquals(999L, user.getId());
    }

    @Test
    void testSetUsername() {
        User user = new User();
        user.setUsername("newuser");
        assertEquals("newuser", user.getUsername());
    }

    @Test
    void testSetPassword() {
        User user = new User();
        user.setPassword("newpassword");
        assertEquals("newpassword", user.getPassword());
    }

    @Test
    void testUpdateUsername() {
        User user = new User("oldname", "pass123");
        assertEquals("oldname", user.getUsername());
        
        user.setUsername("newname");
        assertEquals("newname", user.getUsername());
    }

    @Test
    void testUpdatePassword() {
        User user = new User("admin", "oldpass");
        assertEquals("oldpass", user.getPassword());
        
        user.setPassword("newpass");
        assertEquals("newpass", user.getPassword());
    }

    @Test
    void testNullUsername() {
        User user = new User(null, "password");
        assertNull(user.getUsername());
    }

    @Test
    void testNullPassword() {
        User user = new User("username", null);
        assertNull(user.getPassword());
    }

    @Test
    void testEmptyUsername() {
        User user = new User("", "password");
        assertEquals("", user.getUsername());
    }

    @Test
    void testEmptyPassword() {
        User user = new User("username", "");
        assertEquals("", user.getPassword());
    }
}
