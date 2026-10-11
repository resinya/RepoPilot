# `repo-pilot` Skill

[中文说明](README.md)

Explore an unfamiliar repository by first building a navigable project map, then going deep only into the parts your current goal actually requires.

## What To Use It For

- You just inherited a repository and need to know where to start reading
- You need to run the project, but environment setup is scattered
- You want to know where a feature is implemented and how a business flow runs end to end
- You need onboarding instructions a newcomer can actually follow

## Typical Requests

- `How do I run this repository`
- `Help me understand this project's architecture`
- `How should a newcomer get familiar with this codebase`
- `Where does this business flow start and end`
- `Where is the order status actually changed`

## What You Need To Provide

| Input | Required | Notes |
| --- | --- | --- |
| Repository path or URL | Yes | A local path is safest; a URL must be reachable first |
| Your goal | No | Run it / change a feature / debug / learn the domain. You will be asked if omitted |
| Scope of interest | No | For example "only the payment modules" — speeds things up considerably |

## Outputs

1. **Project map** — a directory tree annotated with responsibilities, grounded in real reference relationships
2. **Architecture layers** — stack, layering, build and deployment, external dependency boundaries
3. **Business flow** — the call path from entry point to data persistence, with `path:line` anchors
4. **Onboarding path** — executable action sequence, including Windows / Linux differences
5. **Coverage gaps** — an explicit list of what was not read

## Boundaries

- It helps you understand a repository; it does not generate business code or refactor plans
- It draws no conclusions about design intent without evidence; inferences are labelled as such
- It does not judge code quality or recommend tech stacks unless you explicitly ask
- When a repository lacks documentation it says "no evidence" rather than filling the gap with generic best practices

## Built-In References

| File | When It Loads |
| --- | --- |
| `references/project-map-protocol.md` | Every exploration — defines how the map is built |
| `references/onboarding-path.md` | Only when the goal is running the project or onboarding someone |

## Workflow

Six steps: build the project map → identify architecture layers → confirm the current goal → trace the business flow → go deep on demand → deliver the onboarding path.

One repository yields four different paths for four different goals, so **step three always confirms what you are trying to do first**.
