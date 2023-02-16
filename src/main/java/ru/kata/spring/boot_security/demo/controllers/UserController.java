package ru.kata.spring.boot_security.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import ru.kata.spring.boot_security.demo.services.RoleService;
import ru.kata.spring.boot_security.demo.services.UserService;

import java.security.Principal;


@Controller
public class UserController {
    private final UserService userService;

    @Autowired
    public UserController(UserService userService, RoleService roleService) {
        this.userService = userService;
    }

    @RequestMapping("/user")
    public String showUser(Principal principal, Model model) {
        model.addAttribute("thisUser", userService.findByUsername(principal.getName()).get());

        return "user-page";
    }

    @RequestMapping("/")
    public String loginPage() {
        return "login";
    }
}
