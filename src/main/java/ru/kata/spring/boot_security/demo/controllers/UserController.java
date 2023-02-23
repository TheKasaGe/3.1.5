package ru.kata.spring.boot_security.demo.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;


@Controller
public class UserController {
    @RequestMapping("/user")
    public String showUser() {
        return "user-page";
    }

    @RequestMapping("/")
    public String loginPage() {
        return "login";
    }
}
