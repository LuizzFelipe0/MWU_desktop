class CurrentUserSession {
  private userId: string | null = null;

  setUserId(userId: string): void {
    this.userId = userId;
  }

  getUserId(): string | null {
    return this.userId;
  }

  clear(): void {
    this.userId = null;
  }
}

export const currentUserSession = new CurrentUserSession();
