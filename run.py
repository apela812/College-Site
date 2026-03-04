#!/usr/bin/env python3
"""
🏥 АЛЬМЕТЬЕВСКИЙ МЕДИЦИНСКИЙ КОЛЛЕДЖ - ИНТЕРАКТИВНЫЙ ЛАУНЧЕР
Красивая и удобная программа для запуска проекта
"""

import os
import sys
import platform
import subprocess
import json
from pathlib import Path

# ════════════════════════════════════════════════════════════════════════════
# ЦВЕТА И СТИЛИ
# ════════════════════════════════════════════════════════════════════════════

class Colors:
    HEADER = '\033[44m\033[1m\033[97m'
    OKGREEN = '\033[92m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    DIM = '\033[2m'
    UNDERLINE = '\033[4m'
    
    # Фон
    BG_BLUE = '\033[44m'
    BG_GREEN = '\033[42m'

# ════════════════════════════════════════════════════════════════════════════
# ФУНКЦИИ ВЫВОДА
# ════════════════════════════════════════════════════════════════════════════

def clear():
    """Очистить консоль"""
    os.system('clear' if platform.system() != 'Windows' else 'cls')

def print_header(text):
    """Печать заголовка"""
    width = 70
    padding = (width - len(text)) // 2
    print(f"\n{Colors.HEADER}{' ' * padding}{text}{' ' * padding}{Colors.ENDC}\n")

def print_title(text):
    """Печать заголовка раздела"""
    print(f"\n{Colors.BOLD}{Colors.OKCYAN}{text}{Colors.ENDC}")
    print(f"{Colors.DIM}{'─' * 70}{Colors.ENDC}\n")

def print_option(num, text, desc=""):
    """Печать опции меню"""
    if desc:
        print(f"  {Colors.BOLD}{Colors.OKBLUE}[{num}]{Colors.ENDC} {text}")
        print(f"      {Colors.DIM}{desc}{Colors.ENDC}")
    else:
        print(f"  {Colors.BOLD}{Colors.OKBLUE}[{num}]{Colors.ENDC} {text}")

def print_success(text):
    """Успех"""
    print(f"{Colors.OKGREEN}✓{Colors.ENDC} {text}")

def print_error(text):
    """Ошибка"""
    print(f"{Colors.FAIL}✗{Colors.ENDC} {text}")

def print_info(text):
    """Информация"""
    print(f"{Colors.OKCYAN}ℹ{Colors.ENDC} {text}")

def print_warn(text):
    """Предупреждение"""
    print(f"{Colors.WARNING}⚠{Colors.ENDC} {text}")

def input_choice(prompt="Выбор"):
    """Получить ввод пользователя"""
    try:
        choice = input(f"\n{Colors.BOLD}➜ {prompt}: {Colors.ENDC}")
        return choice.strip()
    except KeyboardInterrupt:
        print(f"\n\n{Colors.WARNING}Программа прервана{Colors.ENDC}")
        sys.exit(0)

# ════════════════════════════════════════════════════════════════════════════
# ПРОВЕРКИ ТРЕБОВАНИЙ
# ════════════════════════════════════════════════════════════════════════════

def command_exists(command):
    """Проверяет существование команды"""
    try:
        if platform.system() == 'Windows':
            subprocess.run(['where', command],
                         stdout=subprocess.DEVNULL,
                         stderr=subprocess.DEVNULL,
                         timeout=2)
        else:
            subprocess.run(['sh', '-c', f'command -v {command}'],
                         stdout=subprocess.DEVNULL,
                         stderr=subprocess.DEVNULL,
                         timeout=2)
        return True
    except:
        return False

def get_version(command):
    """Получить версию команды"""
    try:
        result = subprocess.run([command, '--version'],
                              capture_output=True,
                              text=True,
                              timeout=2)
        return result.stdout.strip().split('\n')[0] if result.returncode == 0 else 'unknown'
    except:
        return 'unknown'

def check_requirements():
    """Проверить требования системы"""
    print_title("Проверка требований")
    
    # Node.js
    if not command_exists('node'):
        print_error("Node.js не установлен!")
        print_info("Скачайте с https://nodejs.org/")
        return False
    node_ver = get_version('node')
    print_success(f"Node.js {node_ver}")
    
    # npm
    if not command_exists('npm'):
        print_error("NPM не найден!")
        print_info("Скачайте Node.js с https://nodejs.org/")
        return False
    
    npm_ver = get_version('npm')
    print_success(f"NPM {npm_ver}")
    
    # package.json
    if not Path('./package.json').exists():
        print_error("package.json не найден!")
        return False
    print_success("package.json найден")
    
    return True, 'npm'
    
    return True, package_manager

def install_dependencies():
    """Установить зависимости"""
    print_title("Установка зависимостей")
    
    if Path('./node_modules').exists():
        print_success("Зависимости уже установлены")
        return True
    
    print_info("Установка с npm...")
    
    try:
        subprocess.run(['npm', 'install'], check=True)
        print_success("Зависимости установлены")
        return True
    except:
        print_error("Не удалось установить зависимости")
        return False

# ════════════════════════════════════════════════════════════════════════════
# ГЛАВНОЕ МЕНЮ
# ════════════════════════════════════════════════════════════════════════════

def show_banner():
    """Показать банер"""
    clear()
    banner = f"""
{Colors.OKCYAN}{Colors.BOLD}
╔════════════════════════════════════════════════════════════════════════════╗
║                                                                            ║
║        🏥 АЛЬМЕТЬЕВСКИЙ МЕДИЦИНСКИЙ КОЛЛЕДЖ - ИНТЕРАКТИВНЫЙ ЛАУНЧЕР 🏥    ║
║                                                                            ║
║                  Современный веб-сайт медицинского колледжа                ║
║                                                                            ║
╚════════════════════════════════════════════════════════════════════════════╝
{Colors.ENDC}
"""
    print(banner)

def show_project_info():
    """Показать информацию о проекте"""
    print_title("📦 Информация о проекте")
    
    try:
        with open('./package.json', 'r') as f:
            pkg = json.load(f)
        
        print(f"{Colors.OKBLUE}Название:{Colors.ENDC} {pkg.get('name', 'N/A')}")
        print(f"{Colors.OKBLUE}Версия:{Colors.ENDC} {pkg.get('version', 'N/A')}")
        print(f"{Colors.OKBLUE}Описание:{Colors.ENDC} {pkg.get('description', 'N/A')}")
        print(f"{Colors.OKBLUE}Лицензия:{Colors.ENDC} {pkg.get('license', 'N/A')}")
        
        print(f"\n{Colors.OKBLUE}Основные технологии:{Colors.ENDC}")
        deps = pkg.get('dependencies', {})
        tech = []
        if 'react' in deps:
            tech.append('React')
        if 'express' in deps:
            tech.append('Express')
        if 'vite' in deps:
            tech.append('Vite')
        if tech:
            print(f"  • {', '.join(tech)}")
    except:
        print_error("Не удалось прочитать package.json")

def show_main_menu():
    """Главное меню"""
    show_banner()
    
    # Проверка требований
    result = check_requirements()
    if result is False or (isinstance(result, tuple) and not result[0]):
        print_error("Система не готова к запуску")
        input_choice("Нажмите Enter для выхода")
        return
    
    manager = result[1] if isinstance(result, tuple) else 'npm'
    
    while True:
        show_banner()
        print_title("Главное меню")
        
        print_option(1, "▶ Запустить проект (dev)")
        print_option(2, "🏗️  Собрать проект (build)")
        print_option(3, "📦 Запустить собранный проект")
        print_option(4, "📥 Переустановить зависимости")
        print_option(5, "ℹ️  Информация о проекте")
        print_option(6, "🔄 Проверить требования")
        print_option(7, "❌ Выход")
        
        choice = input_choice("Выберите действие")
        
        if choice == '1':
            run_dev()
        elif choice == '2':
            run_build()
        elif choice == '3':
            run_start()
        elif choice == '4':
            reinstall_deps()
        elif choice == '5':
            show_project_info()
            input_choice("Нажмите Enter для продолжения")
        elif choice == '6':
            check_requirements()
            input_choice("Нажмите Enter для продолжения")
        elif choice == '7':
            print(f"\n{Colors.OKGREEN}До свидания! 👋{Colors.ENDC}\n")
            sys.exit(0)
        else:
            print_error("Неверный выбор")
            input_choice("Нажмите Enter для продолжения")

def run_dev():
    """Запустить dev"""
    print_title("▶ Запуск проекта в режиме разработки")
    
    # Красивый вывод ссылок
    print(f"\n{Colors.BOLD}{Colors.OKGREEN}═══════════════════════════════════════════════════════════{Colors.ENDC}")
    print(f"{Colors.BOLD}📱 ССЫЛКА НА ПРОЕКТ:{Colors.ENDC}")
    print(f"{Colors.BOLD}{Colors.OKBLUE}  • Открыть в браузере: {Colors.ENDC}{Colors.UNDERLINE}http://localhost:5000{Colors.ENDC}")
    print(f"{Colors.DIM}    (Vite dev сервер встроен в Express на том же порту){Colors.ENDC}")
    print(f"{Colors.BOLD}{Colors.OKGREEN}═══════════════════════════════════════════════════════════{Colors.ENDC}\n")
    
    print_warn("Нажмите Ctrl+C для остановки сервера")
    print("")
    
    try:
        subprocess.run(['npm', 'run', 'dev'])
    except KeyboardInterrupt:
        print(f"\n{Colors.WARNING}✓ Проект остановлен{Colors.ENDC}")
    except Exception as e:
        print_error(f"Ошибка: {e}")
    
    input_choice("Нажмите Enter для возврата в меню")

def run_build():
    """Собрать проект"""
    print_title("🏗️  Построение проекта")
    
    try:
        result = subprocess.run(['npm', 'run', 'build'])
        
        if result.returncode == 0:
            print_success("Проект успешно собран!")
        else:
            print_error("Ошибка при сборке проекта")
    except Exception as e:
        print_error(f"Ошибка: {e}")
    
    input_choice("Нажмите Enter для возврата в меню")

def run_start():
    """Запустить собранный проект"""
    print_title("📦 Запуск собранного проекта")
    
    if not Path('./dist').exists():
        print_warn("Папка dist не найдена!")
        print_info("Сначала нужно собрать проект (опция 2)")
        input_choice("Нажмите Enter для продолжения")
        return
    
    try:
        subprocess.run(['npm', 'start'])
    except KeyboardInterrupt:
        print(f"\n{Colors.WARNING}Проект остановлен{Colors.ENDC}")
    except Exception as e:
        print_error(f"Ошибка: {e}")
    
    input_choice("Нажмите Enter для возврата в меню")

def reinstall_deps():
    """Переустановить зависимости"""
    print_title("📥 Переустановка зависимостей")
    print_warn("Это удалит папку node_modules и переустановит все зависимости")
    
    choice = input_choice("Вы уверены? (y/n)")
    if choice.lower() != 'y':
        print_info("Отменено")
        input_choice("Нажмите Enter для продолжения")
        return
    
    # Удалить node_modules
    try:
        import shutil
        if Path('./node_modules').exists():
            print_info("Удаляю node_modules...")
            shutil.rmtree('./node_modules')
            print_success("Удалено")
    except Exception as e:
        print_error(f"Ошибка при удалении: {e}")
        input_choice("Нажмите Enter для продолжения")
        return
    
    # Переустановить
    install_dependencies()
    input_choice("Нажмите Enter для продолжения")

# ════════════════════════════════════════════════════════════════════════════
# ГЛАВНАЯ ФУНКЦИЯ
# ════════════════════════════════════════════════════════════════════════════

def main():
    """Главная функция"""
    try:
        show_main_menu()
    except KeyboardInterrupt:
        print(f"\n\n{Colors.WARNING}Программа прервана{Colors.ENDC}\n")
        sys.exit(0)
    except Exception as e:
        print_error(f"Критическая ошибка: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()
