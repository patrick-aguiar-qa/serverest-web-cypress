# Bug reports

Defects found while testing the [ServeRest front-end](https://front.serverest.dev) (public
environment, November 2026). Each one was reproduced at least twice. The tests in
[`cypress/known-issues/`](cypress/known-issues/known-issues.cy.js) assert the **expected** behavior,
so they fail until the bug is fixed (`npm run test:known-issues`).

> ServeRest is a study project, so some of these behaviors may be intentional for teaching purposes.
> They are reported here the way I would report them in a real product.

| ID | Summary | Severity | Priority |
|---|---|---|---|
| [BUG-01](#bug-01--customers-can-open-the-admin-area) | Customers can open the admin area | High | High |
| [BUG-02](#bug-02---does-not-remove-the-last-unit-from-the-shopping-list) | "−" does not remove the last unit from the shopping list | Medium | Medium |
| [BUG-03](#bug-03--shopping-list-accepts-more-units-than-the-stock) | Shopping list accepts more units than the stock | Medium | Medium |
| [BUG-04](#bug-04--editar-button-on-the-product-list-does-nothing) | "Editar" button on the product list does nothing | Medium | Low |
| [BUG-05](#bug-05--typo-in-the-stock-field-placeholder) | Typo in the stock field placeholder | Low | Low |
| [BUG-06](#bug-06--admin-user-list-shows-every-users-password) | Admin user list shows every user's password | High | High |
| [BUG-07](#bug-07--mobile-menu-does-not-open) | Mobile menu does not open | High | High |
| [BUG-08](#bug-08--login-page-has-critical-and-serious-accessibility-violations) | Login page has critical and serious accessibility violations | Medium | Medium |
| [BUG-09](#bug-09--product-links-on-the-store-home-have-no-accessible-name) | Product links on the store home have no accessible name | Medium | Medium |

---

## BUG-01 — Customers can open the admin area

**Severity:** High — a non-admin user sees admin screens (user and product management); the API still blocks
most admin actions, but the user list with passwords is exposed (see BUG-06).

**Steps to reproduce**
1. Log in with a customer account (administrador = false); the store home `/home` opens
2. Type `https://front.serverest.dev/admin/cadastrarusuarios` in the address bar

**Expected result:** the customer is redirected away from `/admin/*` (to `/home` or `/login`).
**Actual result:** the admin "Cadastro de usuários" page opens. The front-end only checks that *a* token exists,
not the user's role.

---

## BUG-02 — "−" does not remove the last unit from the shopping list

**Severity:** Medium — workaround: "Limpar Lista" removes every product.

**Steps to reproduce**
1. Log in as a customer and click "Adicionar a lista" on any product (quantity 1)
2. On "Lista de Compras", click "−"

**Expected result:** the product is removed and "Seu carrinho está vazio" is shown.
**Actual result:** nothing changes; the product stays with "Total: 1".

---

## BUG-03 — Shopping list accepts more units than the stock

**Severity:** Medium — the customer only finds out later that the order cannot be completed
(the API rejects it with `Produto não possui quantidade suficiente`).

**Steps to reproduce**
1. As an admin, create a product with stock (quantidade) = 2
2. As a customer, add it to the shopping list and click "+" twice

**Expected result:** the quantity stops at 2 (with a message about the stock limit).
**Actual result:** "Total: 3".

---

## BUG-04 — "Editar" button on the product list does nothing

**Severity:** Medium — there is no way to edit a product from the UI. **Type:** broken button.

**Steps to reproduce**
1. Log in as an admin and open "Listar Produtos"
2. Click "Editar" on any row

**Expected result:** an edit form opens for that product.
**Actual result:** nothing happens (the same happens with "Editar" on "Listar Usuários").

---

## BUG-05 — Typo in the stock field placeholder

**Severity:** Low (cosmetic).

**Steps to reproduce:** log in as an admin and open "Cadastrar Produtos".

**Expected result:** placeholder "Digite a quantidade do produto".
**Actual result:** "Digite aquantidade do produto".

---

## BUG-06 — Admin user list shows every user's password

**Severity:** High (security) — passwords are displayed in plain text.

**Steps to reproduce:** log in as an admin and open "Listar Usuários".

**Expected result:** no password column (passwords are never displayed).
**Actual result:** a "Senha" column shows every user's password. Related to the API returning passwords on
`GET /usuarios` (see the [API test project](https://github.com/patrick-aguiar-qa/serverest-api-tests/blob/main/BUG_REPORTS.md)).

---

## BUG-07 — Mobile menu does not open

**Severity:** High — on phones the customer cannot reach "Lista de Compras", "Carrinho" or "Logout"
from the menu; no workaround besides typing URLs.

**Steps to reproduce**
1. Open the site with a 375 × 812 viewport (iPhone X) and log in as a customer
2. Tap the menu button (☰) at the top

**Expected result:** the navigation links and "Logout" are shown.
**Actual result:** nothing happens; the menu stays collapsed.

---

## BUG-08 — Login page has critical and serious accessibility violations

**Severity:** Medium — affects screen reader and low-vision users (WCAG 2.x). Found with axe-core.

**Steps to reproduce:** open `/login` and run an axe scan (axe DevTools → Full Page Scan, or `npm run test:known-issues`).

**Expected result:** no critical or serious violations.
**Actual result:**
- **critical — `image-alt`:** the ServeRest logo has no `alt` text (also on the sign-up page)
- **serious — `color-contrast`:** text with contrast below the 4.5:1 minimum (1 element on login, 2 on sign-up)

---

## BUG-09 — Product links on the store home have no accessible name

**Severity:** Medium (WCAG `link-name`, serious) — a screen reader announces every product image as just "link".

**Steps to reproduce:** log in as a customer and run an axe scan on `/home`.

**Expected result:** each product link has an accessible name (e.g. the product name as the image `alt`).
**Actual result:** 247 links without an accessible name (one per product image link on the public environment).
