error1 = [7.13e-4 1.82e-4 4.70e-5 1.23e-5 3.23e-6]
error2 = [2.41e-3 6.17e-4 1.41e-4 3.46e-5 8.73e-6]
error3 = [6.27e-5 1.48e-5 3.65e-6]
error4 = [9.85e-5 1.17e-5 1.42e-6]
figure(1)
F1=loglog([1/8 1/16 1/32 1/64 1/128],error1,'-*','DisplayName','$V^1$','linewidth',2)
hold on
loglog([1/2^5.5,1/2^6.5],[sqrt(error1(2)*error1(3))/5,1/5*sqrt(error1(3)*error1(4))],'-k','linewidth',2)
txt1 = 'slope = 2';
text(1/64+0.001,error1(4)/1.5,txt1,'FontSize',15)
F2=loglog([1/8 1/16 1/32 1/64 1/128],error2,'-o','DisplayName','$V^1_{\frac{1}{2}}$','linewidth',2)
txt1 = 'slope = 2';
loglog([1/2^4.5,1/2^5.5],[sqrt(error2(1)*error2(2))/3,1/3*sqrt(error2(2)*error2(3))],'-k','linewidth',2)
text(1/48,error2(3)*2,txt1,'FontSize',15)
F3=loglog([1/8 1/16 1/32],error3,'-d','DisplayName','$V^2$','linewidth',2)
txt1 = 'slope = 2';
text(1/16/1.4,error3(2)*2,txt1,'FontSize',15)
loglog([1/2^3.5,1/2^4.5],[sqrt(error3(1)*error3(2))*1.3,1.3*sqrt(error3(2)*error3(3))],'-k','linewidth',2)
F4=loglog([1/8 1/16 1/32],error4,'-v','DisplayName','$V^2_{\frac{1}{2}}$','linewidth',2)
txt1 = 'slope = 3';
text(1/16/1.3,error4(2)/4,txt1,'FontSize',15)
loglog([1/2^3.5,1/2^4.5],[sqrt(error4(1)*error4(2))/1.5,1/1.5*sqrt(error4(2)*error4(3))],'-k','linewidth',2)
xlabel("h")
ylabel("error")
set(gca, 'FontSize', 20)

hold off
legend([F1,F2,F3,F4],'Interpreter','latex')
print Figure1.eps -depsc2 -r600

error1 = [1.44e-3 4.14e-4 1.98e-4 1.18e-4 7.89e-5 5.65e-5]
error2 = [6.23e-3 1.76e-3 7.47e-4 4.22e-4 2.64e-4 1.85e-4]
error3 = [2.10e-4 5.82e-5 2.78e-5 1.65e-5 1.11e-5]
error4 = [5.19e-4 5.55e-5 1.58e-5 7.25e-6 2.15e-6]

figure(2)
F1=loglog([1/8 1/16 1/24 1/32 1/40 1/48],error1,'-*','DisplayName','$V^1$','linewidth',2)
hold on
loglog([sqrt(1/(8*16)),sqrt(1/(16*24))],[sqrt(error1(1)*error1(2))/1.5,1/1.5*sqrt(error1(2)*error1(3))],'-k','linewidth',2)
txt1 = 'slope = 1.8';
text(1/20,error1(2)/2.4,txt1,'FontSize',15)


F2 = loglog([1/8 1/16 1/24 1/32 1/40 1/48],error2,'-o','DisplayName','$V^1_{\frac{1}{3}}$','linewidth',2)
loglog([sqrt(1/(16*24)),sqrt(1/(24*32))],[sqrt(error2(2)*error2(3))*1.5,1.5*sqrt(error2(3)*error2(4))],'-k','linewidth',2)
txt1 = 'slope = 2';
text(1/28,error2(3)*2.3,txt1,'FontSize',15)

F3 = loglog([1/8 1/16 1/24 1/32 1/40],error3,'-x','DisplayName','$V^2$','linewidth',2)
loglog([sqrt(1/(16*24)),sqrt(1/(24*32))],[sqrt(error3(2)*error3(3))*1.5,1.5*sqrt(error3(3)*error3(4))],'-k','linewidth',2)
txt1 = 'slope = 1.8';
text(1/28,error3(3)*2.4,txt1,'FontSize',15)

F4 = loglog([1/8 1/16 1/24 1/32 1/40],error4,'-d','DisplayName','$V^2_{\frac{1}{3}}$','linewidth',2)
loglog([sqrt(1/(16*24)),sqrt(1/(24*32))],[sqrt(error4(2)*error4(3))/1.5,1/1.5*sqrt(error4(3)*error4(4))],'-k','linewidth',2)
txt1 = 'slope = 3';
text(1/28,error4(3)/2.3,txt1,'FontSize',15)
xlabel("h")
ylabel("error")
set(gca, 'FontSize', 20)

hold off
legend([F1,F2,F3,F4],'Interpreter','latex')
print Figure2.eps -depsc2 -r600