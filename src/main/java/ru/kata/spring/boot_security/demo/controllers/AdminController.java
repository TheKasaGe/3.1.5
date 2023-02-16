package ru.kata.spring.boot_security.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import ru.kata.spring.boot_security.demo.entities.Role;
import ru.kata.spring.boot_security.demo.entities.User;
import ru.kata.spring.boot_security.demo.services.RoleService;
import ru.kata.spring.boot_security.demo.services.UserService;

import java.security.Principal;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Controller
public class AdminController {
    private final UserService userService;
    private final RoleService roleService;

    @Autowired
    public AdminController(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }

    @RequestMapping("/admin")
    public String allUsersAndAddUser(Principal principal, Model model) {
        //список всех пользователей
        model.addAttribute("allUsers", userService.getAllUsers());
        //отображение в шапке пользователя
        model.addAttribute("thisUser", userService.findByUsername(principal.getName()).get());
        //добавление нового пользователя
        model.addAttribute("newUser", new User());
        model.addAttribute("allRoles", roleService.getAllRoles());

        return "admin-page";
    }

    @RequestMapping("/admin/saveUser")
    public String saveUser(@ModelAttribute("user") User user) {

        userService.saveUser(user);
        return "redirect:/admin";
    }

    @RequestMapping("/admin/updateUser")
    public String updateUser(@ModelAttribute("user") User user, @RequestParam("userRoles") String[] userRoles) {
        List<Role> roleSet = Arrays.stream(userRoles)
                .map(roleService::getRoleByName)
                .collect(Collectors.toList());

        user.setRoles(roleSet);
        userService.saveUser(user);

        return "redirect:/admin";
    }

    @RequestMapping("/admin/deleteUser")
    public String deleteUser(@RequestParam("userId") int userId, Model model) {

        userService.removeUserById(userId);

        return "redirect:/admin";
    }

}
