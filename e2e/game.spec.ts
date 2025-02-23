import { expect, test } from "@playwright/test";

test.describe("Trivia Game", () => {
  test("complete game flow", async ({ page }) => {
    // Start new game
    await page.goto("/");
    await expect(page).toHaveTitle("Structured Output Demo");

    // Submit new game form
    const startButton = page.getByRole("button", { name: "New Trivia Game" });
    await expect(startButton).toBeVisible();
    await startButton.click();

    // Verify game page loaded
    await expect(page).toHaveURL(/\/games\/.+/, {
      timeout: 20000,
    });
    await expect(
      page.getByRole("heading", { name: "Trivia Game" })
    ).toBeVisible();

    await expect(page.getByRole("radio").nth(0)).toBeVisible();

    // Play through questions
    while (await page.getByRole("radio").nth(0).isVisible()) {
      // Select first answer for each question
      const firstChoice = page.getByRole("radio").nth(0);
      await firstChoice.check();

      // Submit answer
      await page.getByRole("button", { name: "Submit Answer" }).click();

      // Verify answer view
      await expect(page.getByText(/Your answer:/)).toBeVisible();

      // Click next if available
      const nextButton = page.getByRole("button", {
        name: /Next Question|Continue/,
      });
      if (await nextButton.isVisible()) {
        await nextButton.click();
      }
    }

    // Verify game summary
    await expect(page.getByRole("heading", { name: "Results" })).toBeVisible();
    await expect(page.getByText(/Correct answers:/)).toBeVisible();

    // Test Play Again
    // const playAgainButton = page.getByRole("button", { name: "Play Again" });
    // await expect(playAgainButton).toBeVisible();
    // await playAgainButton.click();

    // Verify game reset
    // await expect(
    //   page.getByRole("button", { name: "Submit Answer" })
    // ).toBeVisible();

    // Test New Game
    // await page.getByRole("button", { name: "New Trivia Game" }).click();

    // Verify new game started
    // await expect(page).toHaveURL(/\/games\/.+/, {
    //   timeout: 15000,
    // });
    // await expect(
    //   page.getByRole("heading", { name: "Trivia Game" })
    // ).toBeVisible();
  });

  test("handles errors gracefully", async ({ page }) => {
    // Test invalid game ID
    await page.goto("/games/invalid-id");
    await expect(page).toHaveURL("/?error=true");
    await expect(page.getByText("Sorry, something went wrong")).toBeVisible();
  });
});
