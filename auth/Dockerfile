FROM node:alpine

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable


WORKDIR /app

COPY pnpm-lock.yaml package.json ./

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

COPY . .

CMD [ "pnpm", "dev" ]