import tkinter as tk
from tkinter import messagebox

class TicTacToe:
    def __init__(self, master):
        self.master = master
        master.title("Tic Tac Toe")
        master.resizable(False, False)
        self.current_player = 'X'
        self.buttons = []
        self.board = ['' for _ in range(9)]
        self.create_widgets()

    def create_widgets(self):
        frame = tk.Frame(self.master, bg='#2c3e50', padx=10, pady=10)
        frame.pack()

        self.status = tk.Label(frame, text="Player X's turn", font=('Arial', 16), bg='#2c3e50', fg='white')
        self.status.grid(row=0, column=0, columnspan=3, pady=(0, 10))

        for i in range(9):
            btn = tk.Button(frame, text='', font=('Helvetica', 24), width=4, height=2,
                            command=lambda i=i: self.on_button_click(i), bg='#ecf0f1')
            btn.grid(row=1+i//3, column=i%3, padx=5, pady=5)
            self.buttons.append(btn)

        reset_btn = tk.Button(frame, text='Reset Game', command=self.reset_game, bg='#3498db', fg='white')
        reset_btn.grid(row=4, column=0, columnspan=3, sticky='nsew', pady=(10, 0))

    def on_button_click(self, index):
        if self.board[index] or self.check_winner():
            return
        self.board[index] = self.current_player
        self.buttons[index]['text'] = self.current_player
        if self.check_winner():
            self.status['text'] = f'Player {self.current_player} wins!'
            messagebox.showinfo('Game Over', f'Player {self.current_player} wins!')
        elif all(self.board):
            self.status['text'] = 'Draw!'
            messagebox.showinfo('Game Over', 'Draw!')
        else:
            self.current_player = 'O' if self.current_player == 'X' else 'X'
            self.status['text'] = f"Player {self.current_player}'s turn"

    def check_winner(self):
        b = self.board
        combos = [
            (0, 1, 2), (3, 4, 5), (6, 7, 8),  # rows
            (0, 3, 6), (1, 4, 7), (2, 5, 8),  # cols
            (0, 4, 8), (2, 4, 6)              # diags
        ]
        return any(b[a] == b[b_] == b[c] != '' for a, b_, c in combos)

    def reset_game(self):
        self.board = ['' for _ in range(9)]
        for btn in self.buttons:
            btn['text'] = ''
        self.current_player = 'X'
        self.status['text'] = "Player X's turn"


def main():
    root = tk.Tk()
    TicTacToe(root)
    root.mainloop()

if __name__ == '__main__':
    main()
