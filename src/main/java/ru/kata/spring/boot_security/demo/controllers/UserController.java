package ru.kata.spring.boot_security.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import ru.kata.spring.boot_security.demo.entities.Role;
import ru.kata.spring.boot_security.demo.entities.User;
import ru.kata.spring.boot_security.demo.repositories.RoleRepository;
import ru.kata.spring.boot_security.demo.services.UserService;


import javax.validation.Valid;
import java.security.Principal;
import java.util.List;

@Controller
public class UserController {
    private final UserService userService;
    private final RoleRepository roleRepository;

    @Autowired
    public UserController(UserService userService, RoleRepository roleRepository) {
        this.userService = userService;
        this.roleRepository = roleRepository;
    }

    @RequestMapping("/admin")
    public String allUsers(Principal principal, Model model) {
        //список всех пользователей
        model.addAttribute("allUsers", userService.getAllUsers());
        //отображение в шапке пользователя
        model.addAttribute("thisUser", userService.findByUsername(principal.getName()).get());
        //добавление нового пользователя
        model.addAttribute("newUser", new User());
        model.addAttribute("allRoles", roleRepository.findAll());

        return "admin-page";
    }

//    @RequestMapping("/admin/addNewUser")
//    public String addNewUser(Model model) {
//
//        User newUser = new User();
//        model.addAttribute("user", newUser);
//        List<Role> allRoles = roleRepository.findAll();
//        model.addAttribute("allRoles", allRoles);
//
//       return "user-info";
//    }

    @RequestMapping("/admin/saveUser")
    public String saveUser(@ModelAttribute("user") User user) {

        userService.saveUser(user);
        System.out.println("Ошибок нет, все ок!");

        System.out.println(user);
        System.out.println("МЫ в сохранениии!!!!!!!!!!!!!!!");
        return "redirect:/admin";
    }

//    @RequestMapping("/admin/saveUser")
//    public String saveUser(@ModelAttribute("user") User user) {
//        userService.saveUser(user);
//
//        return "redirect:/admin";
//    }

//    @RequestMapping("/admin/updateUser")
//    public String updateUser(@RequestParam("userId") int userId, Model model) {
//
//        User user = userService.getUser(userId);
//        model.addAttribute("user", user);
//        List<Role> roles = roleRepository.findAll();
//        model.addAttribute("roles", roles);
//
//        return "user-info";
//    }
//    @RequestMapping("/{id}/update")
//    public String updateUser(@ModelAttribute("user") User user, Model model) {
//        model.addAttribute("roles", roleRepository.findAll());
//        userService.saveUser(user);
//        return "redirect:/admin";
//    }

    @RequestMapping("/admin/deleteUser")
    public String deleteUser(@RequestParam("userId") int userId, Model model) {

        userService.removeUserById(userId);

        return "redirect:/admin";
    }

    @RequestMapping("/user")
    public String showUser(Principal principal, Model model) {
        User user = userService.findByUsername(principal.getName()).get();
        model.addAttribute("user", user);
        return "user";
    }

    @RequestMapping("/")
    public String loginPage() {
        return "login";
    }


}
