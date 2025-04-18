-- NeoUI Library (Loadstring Version)
-- A sleek UI library with smooth animations and notification system
-- Use: loadstring(game:HttpGet("https://raw.githubusercontent.com/yourusername/NeoUI/main/NeoUI.lua"))()

-- Create the module
local NeoUI = {}
NeoUI.__index = NeoUI
NeoUI.Version = "1.0.0"

-- Configuration
local config = {
    TweenSpeed = 0.25,
    Theme = {
        Primary = Color3.fromRGB(25, 25, 35),
        Secondary = Color3.fromRGB(35, 35, 45),
        Accent = Color3.fromRGB(114, 137, 218), -- Discord-like blue
        Text = Color3.fromRGB(255, 255, 255),
        Inactive = Color3.fromRGB(125, 125, 135),
        Success = Color3.fromRGB(67, 181, 129),
        Warning = Color3.fromRGB(240, 184, 49),
        Error = Color3.fromRGB(240, 71, 71),
    },
    Font = Enum.Font.Gotham,
    CornerRadius = UDim.new(0, 8),
    ElementHeight = 40,
    Padding = 10,
}

-- Create the main UI
function NeoUI.new(title)
    local self = setmetatable({}, NeoUI)
    self.Dragging = false
    self.DragStart = nil
    self.StartPosition = nil
    
    -- Create ScreenGui
    self.ScreenGui = Instance.new("ScreenGui")
    self.ScreenGui.Name = "NeoUI"
    self.ScreenGui.ResetOnSpawn = false
    self.ScreenGui.ZIndexBehavior = Enum.ZIndexBehavior.Sibling
    
    -- For Synapse X / Script-Ware support
    if syn then
        syn.protect_gui(self.ScreenGui)
        self.ScreenGui.Parent = game.CoreGui
    elseif gethui then
        self.ScreenGui.Parent = gethui()
    else
        self.ScreenGui.Parent = game.Players.LocalPlayer:WaitForChild("PlayerGui")
    end
    
    -- Create main frame
    self.Main = Instance.new("Frame")
    self.Main.Name = "Main"
    self.Main.BackgroundColor3 = config.Theme.Primary
    self.Main.BorderSizePixel = 0
    self.Main.Position = UDim2.new(0.5, -200, 0.5, -150)
    self.Main.Size = UDim2.new(0, 400, 0, 300)
    self.Main.AnchorPoint = Vector2.new(0.5, 0.5)
    self.Main.ClipsDescendants = true
    self.Main.Parent = self.ScreenGui
    
    -- Add corner radius
    local corner = Instance.new("UICorner")
    corner.CornerRadius = config.CornerRadius
    corner.Parent = self.Main
    
    -- Add shadow
    local shadow = Instance.new("ImageLabel")
    shadow.Name = "Shadow"
    shadow.BackgroundTransparency = 1
    shadow.Position = UDim2.new(0.5, 0, 0.5, 0)
    shadow.Size = UDim2.new(1, 30, 1, 30)
    shadow.AnchorPoint = Vector2.new(0.5, 0.5)
    shadow.Image = "rbxassetid://5554236805"
    shadow.ImageColor3 = Color3.fromRGB(0, 0, 0)
    shadow.ImageTransparency = 0.6
    shadow.ScaleType = Enum.ScaleType.Slice
    shadow.SliceCenter = Rect.new(23, 23, 277, 277)
    shadow.ZIndex = -1
    shadow.Parent = self.Main
    
    -- Create title bar
    self.TitleBar = Instance.new("Frame")
    self.TitleBar.Name = "TitleBar"
    self.TitleBar.BackgroundColor3 = config.Theme.Secondary
    self.TitleBar.BorderSizePixel = 0
    self.TitleBar.Size = UDim2.new(1, 0, 0, 40)
    self.TitleBar.Parent = self.Main
    
    local titleCorner = Instance.new("UICorner")
    titleCorner.CornerRadius = UDim.new(0, 8)
    titleCorner.Parent = self.TitleBar
    
    -- Title text
    self.Title = Instance.new("TextLabel")
    self.Title.Name = "Title"
    self.Title.BackgroundTransparency = 1
    self.Title.Position = UDim2.new(0, 15, 0, 0)
    self.Title.Size = UDim2.new(1, -40, 1, 0)
    self.Title.Font = config.Font
    self.Title.Text = title or "NeoUI Example"
    self.Title.TextColor3 = config.Theme.Text
    self.Title.TextSize = 18
    self.Title.TextXAlignment = Enum.TextXAlignment.Left
    self.Title.Parent = self.TitleBar
    
    -- Close button
    self.CloseButton = Instance.new("TextButton")
    self.CloseButton.Name = "CloseButton"
    self.CloseButton.BackgroundTransparency = 1
    self.CloseButton.Position = UDim2.new(1, -40, 0, 0)
    self.CloseButton.Size = UDim2.new(0, 40, 1, 0)
    self.CloseButton.Font = Enum.Font.GothamBold
    self.CloseButton.Text = "×"
    self.CloseButton.TextColor3 = config.Theme.Inactive
    self.CloseButton.TextSize = 24
    self.CloseButton.Parent = self.TitleBar
    
    -- Container for tabs
    self.TabContainer = Instance.new("Frame")
    self.TabContainer.Name = "TabContainer"
    self.TabContainer.BackgroundColor3 = config.Theme.Secondary
    self.TabContainer.BorderSizePixel = 0
    self.TabContainer.Position = UDim2.new(0, 0, 0, 40)
    self.TabContainer.Size = UDim2.new(0, 100, 1, -40)
    self.TabContainer.Parent = self.Main
    
    local tabContainerCorner = Instance.new("UICorner")
    tabContainerCorner.CornerRadius = UDim.new(0, 8)
    tabContainerCorner.Parent = self.TabContainer
    
    -- Fix the corner radius for tab container
    local fixCorner = Instance.new("Frame")
    fixCorner.Name = "FixCorner"
    fixCorner.BackgroundColor3 = config.Theme.Secondary
    fixCorner.BorderSizePixel = 0
    fixCorner.Position = UDim2.new(1, -8, 0, 0)
    fixCorner.Size = UDim2.new(0, 8, 1, 0)
    fixCorner.Parent = self.TabContainer
    
    -- Tab button container
    self.TabButtonContainer = Instance.new("ScrollingFrame")
    self.TabButtonContainer.Name = "TabButtonContainer"
    self.TabButtonContainer.BackgroundTransparency = 1
    self.TabButtonContainer.Position = UDim2.new(0, 0, 0, 10)
    self.TabButtonContainer.Size = UDim2.new(1, 0, 1, -10)
    self.TabButtonContainer.CanvasSize = UDim2.new(0, 0, 0, 0)
    self.TabButtonContainer.ScrollBarThickness = 0
    self.TabButtonContainer.Parent = self.TabContainer
    
    local tabListLayout = Instance.new("UIListLayout")
    tabListLayout.Name = "TabListLayout"
    tabListLayout.Padding = UDim.new(0, 5)
    tabListLayout.HorizontalAlignment = Enum.HorizontalAlignment.Center
    tabListLayout.Parent = self.TabButtonContainer
    
    -- Content area
    self.ContentContainer = Instance.new("Frame")
    self.ContentContainer.Name = "ContentContainer"
    self.ContentContainer.BackgroundTransparency = 1
    self.ContentContainer.Position = UDim2.new(0, 100, 0, 40)
    self.ContentContainer.Size = UDim2.new(1, -100, 1, -40)
    self.ContentContainer.Parent = self.Main
    
    -- Notification container
    self.NotificationContainer = Instance.new("Frame")
    self.NotificationContainer.Name = "NotificationContainer"
    self.NotificationContainer.BackgroundTransparency = 1
    self.NotificationContainer.Position = UDim2.new(1, 20, 0, 0)
    self.NotificationContainer.Size = UDim2.new(0, 300, 1, 0)
    self.NotificationContainer.Parent = self.ScreenGui
    
    local notificationListLayout = Instance.new("UIListLayout")
    notificationListLayout.Name = "NotificationListLayout"
    notificationListLayout.Padding = UDim.new(0, 10)
    notificationListLayout.HorizontalAlignment = Enum.HorizontalAlignment.Center
    notificationListLayout.VerticalAlignment = Enum.VerticalAlignment.Bottom
    notificationListLayout.Parent = self.NotificationContainer
    
    -- Set up dragging functionality
    self:SetupDragging()
    
    -- Set up close button functionality
    self.CloseButton.MouseEnter:Connect(function()
        self.CloseButton.TextColor3 = config.Theme.Error
    end)
    
    self.CloseButton.MouseLeave:Connect(function()
        self.CloseButton.TextColor3 = config.Theme.Inactive
    end)
    
    self.CloseButton.MouseButton1Click:Connect(function()
        self:Close()
    end)
    
    self.Tabs = {}
    self.ActiveTab = nil
    
    return self
end

-- Setup dragging functionality
function NeoUI:SetupDragging()
    local dragInput
    local dragStart
    local startPos
    
    local function updateInput(input)
        local delta = input.Position - dragStart
        self.Main.Position = UDim2.new(startPos.X.Scale, startPos.X.Offset + delta.X, startPos.Y.Scale, startPos.Y.Offset + delta.Y)
    end
    
    self.TitleBar.InputBegan:Connect(function(input)
        if input.UserInputType == Enum.UserInputType.MouseButton1 then
            self.Dragging = true
            dragStart = input.Position
            startPos = self.Main.Position
            
            input.Changed:Connect(function()
                if input.UserInputState == Enum.UserInputState.End then
                    self.Dragging = false
                end
            end)
        end
    end)
    
    self.TitleBar.InputChanged:Connect(function(input)
        if input.UserInputType == Enum.UserInputType.MouseMovement then
            dragInput = input
        end
    end)
    
    game:GetService("UserInputService").InputChanged:Connect(function(input)
        if input == dragInput and self.Dragging then
            updateInput(input)
        end
    end)
end

-- Add a tab to the UI
function NeoUI:AddTab(name, icon)
    local tabId = #self.Tabs + 1
    
    -- Create tab button
    local tabButton = Instance.new("TextButton")
    tabButton.Name = name.."Button"
    tabButton.BackgroundColor3 = config.Theme.Secondary
    tabButton.BorderSizePixel = 0
    tabButton.Size = UDim2.new(0, 80, 0, 30)
    tabButton.Font = config.Font
    tabButton.Text = name
    tabButton.TextColor3 = config.Theme.Inactive
    tabButton.TextSize = 14
    tabButton.Parent = self.TabButtonContainer
    
    local tabButtonCorner = Instance.new("UICorner")
    tabButtonCorner.CornerRadius = UDim.new(0, 6)
    tabButtonCorner.Parent = tabButton
    
    -- Create tab content frame
    local tabContent = Instance.new("ScrollingFrame")
    tabContent.Name = name.."Content"
    tabContent.BackgroundTransparency = 1
    tabContent.BorderSizePixel = 0
    tabContent.Position = UDim2.new(0, 10, 0, 10)
    tabContent.Size = UDim2.new(1, -20, 1, -20)
    tabContent.ScrollBarThickness = 4
    tabContent.ScrollBarImageColor3 = config.Theme.Accent
    tabContent.Visible = false
    tabContent.Parent = self.ContentContainer
    
    local contentPadding = Instance.new("UIPadding")
    contentPadding.PaddingLeft = UDim.new(0, 10)
    contentPadding.PaddingRight = UDim.new(0, 5)
    contentPadding.PaddingTop = UDim.new(0, 10)
    contentPadding.PaddingBottom = UDim.new(0, 10)
    contentPadding.Parent = tabContent
    
    local contentListLayout = Instance.new("UIListLayout")
    contentListLayout.Name = "ContentListLayout"
    contentListLayout.Padding = UDim.new(0, 10)
    contentListLayout.HorizontalAlignment = Enum.HorizontalAlignment.Center
    contentListLayout.SortOrder = Enum.SortOrder.LayoutOrder
    contentListLayout.Parent = tabContent
    
    -- Auto-size the scrolling frame
    contentListLayout:GetPropertyChangedSignal("AbsoluteContentSize"):Connect(function()
        tabContent.CanvasSize = UDim2.new(0, 0, 0, contentListLayout.AbsoluteContentSize.Y + 20)
    end)
    
    local tab = {
        Button = tabButton,
        Content = tabContent,
        Name = name,
    }
    
    -- Button click event
    tabButton.MouseButton1Click:Connect(function()
        self:SelectTab(tabId)
    end)
    
    -- Button hover effects
    tabButton.MouseEnter:Connect(function()
        if self.ActiveTab ~= tabId then
            game:GetService("TweenService"):Create(tabButton, TweenInfo.new(0.2), {
                BackgroundColor3 = config.Theme.Primary,
                TextColor3 = config.Theme.Text
            }):Play()
        end
    end)
    
    tabButton.MouseLeave:Connect(function()
        if self.ActiveTab ~= tabId then
            game:GetService("TweenService"):Create(tabButton, TweenInfo.new(0.2), {
                BackgroundColor3 = config.Theme.Secondary,
                TextColor3 = config.Theme.Inactive
            }):Play()
        end
    end)
    
    table.insert(self.Tabs, tab)
    
    -- Select this tab if it's the first one
    if #self.Tabs == 1 then
        self:SelectTab(1)
    end
    
    return {
        AddButton = function(text, callback)
            return self:AddButton(tabId, text, callback)
        end,
        AddToggle = function(text, default, callback)
            return self:AddToggle(tabId, text, default, callback)
        end,
        AddSlider = function(text, min, max, default, callback)
            return self:AddSlider(tabId, text, min, max, default, callback)
        end,
        AddLabel = function(text)
            return self:AddLabel(tabId, text)
        end
    }
end

-- Select a tab
function NeoUI:SelectTab(tabId)
    -- Deselect current tab if there is one
    if self.ActiveTab then
        local currentTab = self.Tabs[self.ActiveTab]
        currentTab.Content.Visible = false
        game:GetService("TweenService"):Create(currentTab.Button, TweenInfo.new(0.2), {
            BackgroundColor3 = config.Theme.Secondary,
            TextColor3 = config.Theme.Inactive
        }):Play()
    end
    
    -- Select new tab
    local newTab = self.Tabs[tabId]
    newTab.Content.Visible = true
    game:GetService("TweenService"):Create(newTab.Button, TweenInfo.new(0.2), {
        BackgroundColor3 = config.Theme.Accent,
        TextColor3 = config.Theme.Text
    }):Play()
    
    self.ActiveTab = tabId
end

-- Add a button to a tab
function NeoUI:AddButton(tabId, text, callback)
    local tab = self.Tabs[tabId]
    
    local button = Instance.new("TextButton")
    button.Name = text.."Button"
    button.BackgroundColor3 = config.Theme.Secondary
    button.BorderSizePixel = 0
    button.Size = UDim2.new(1, -10, 0, config.ElementHeight)
    button.Font = config.Font
    button.Text = text
    button.TextColor3 = config.Theme.Text
    button.TextSize = 14
    button.Parent = tab.Content
    
    local buttonCorner = Instance.new("UICorner")
    buttonCorner.CornerRadius = UDim.new(0, 6)
    buttonCorner.Parent = button
    
    -- Button click event
    button.MouseButton1Click:Connect(function()
        -- Animation effect
        game:GetService("TweenService"):Create(button, TweenInfo.new(0.1), {
            BackgroundColor3 = config.Theme.Accent
        }):Play()
        
        if callback then callback() end
        
        wait(0.1)
        game:GetService("TweenService"):Create(button, TweenInfo.new(0.1), {
            BackgroundColor3 = config.Theme.Secondary
        }):Play()
    end)
    
    -- Button hover effects
    button.MouseEnter:Connect(function()
        game:GetService("TweenService"):Create(button, TweenInfo.new(0.2), {
            BackgroundColor3 = config.Theme.Primary
        }):Play()
    end)
    
    button.MouseLeave:Connect(function()
        game:GetService("TweenService"):Create(button, TweenInfo.new(0.2), {
            BackgroundColor3 = config.Theme.Secondary
        }):Play()
    end)
    
    return button
end

-- Add a toggle to a tab
function NeoUI:AddToggle(tabId, text, default, callback)
    local tab = self.Tabs[tabId]
    local value = default or false
    
    local toggleContainer = Instance.new("Frame")
    toggleContainer.Name = text.."Toggle"
    toggleContainer.BackgroundColor3 = config.Theme.Secondary
    toggleContainer.BorderSizePixel = 0
    toggleContainer.Size = UDim2.new(1, -10, 0, config.ElementHeight)
    toggleContainer.Parent = tab.Content
    
    local containerCorner = Instance.new("UICorner")
    containerCorner.CornerRadius = UDim.new(0, 6)
    containerCorner.Parent = toggleContainer
    
    local label = Instance.new("TextLabel")
    label.Name = "Label"
    label.BackgroundTransparency = 1
    label.Position = UDim2.new(0, 10, 0, 0)
    label.Size = UDim2.new(1, -60, 1, 0)
    label.Font = config.Font
    label.Text = text
    label.TextColor3 = config.Theme.Text
    label.TextSize = 14
    label.TextXAlignment = Enum.TextXAlignment.Left
    label.Parent = toggleContainer
    
    local toggleBg = Instance.new("Frame")
    toggleBg.Name = "Background"
    toggleBg.BackgroundColor3 = config.Theme.Primary
    toggleBg.BorderSizePixel = 0
    toggleBg.Position = UDim2.new(1, -50, 0.5, -10)
    toggleBg.Size = UDim2.new(0, 40, 0, 20)
    toggleBg.Parent = toggleContainer
    
    local toggleCorner = Instance.new("UICorner")
    toggleCorner.CornerRadius = UDim.new(1, 0)
    toggleCorner.Parent = toggleBg
    
    local toggleIndicator = Instance.new("Frame")
    toggleIndicator.Name = "Indicator"
    toggleIndicator.BackgroundColor3 = config.Theme.Text
    toggleIndicator.BorderSizePixel = 0
    toggleIndicator.Position = UDim2.new(0, 2, 0.5, -8)
    toggleIndicator.Size = UDim2.new(0, 16, 0, 16)
    toggleIndicator.Parent = toggleBg
    
    local indicatorCorner = Instance.new("UICorner")
    indicatorCorner.CornerRadius = UDim.new(1, 0)
    indicatorCorner.Parent = toggleIndicator
    
    -- Initialize toggle state
    local function updateToggle()
        if value then
            game:GetService("TweenService"):Create(toggleBg, TweenInfo.new(0.2), {
                BackgroundColor3 = config.Theme.Accent
            }):Play()
            game:GetService("TweenService"):Create(toggleIndicator, TweenInfo.new(0.2), {
                Position = UDim2.new(0, 22, 0.5, -8)
            }):Play()
        else
            game:GetService("TweenService"):Create(toggleBg, TweenInfo.new(0.2), {
                BackgroundColor3 = config.Theme.Primary
            }):Play()
            game:GetService("TweenService"):Create(toggleIndicator, TweenInfo.new(0.2), {
                Position = UDim2.new(0, 2, 0.5, -8)
            }):Play()
        end
        
        if callback then callback(value) end
    end
    
    -- Initial state
    updateToggle()
    
    -- Toggle click event
    toggleContainer.InputBegan:Connect(function(input)
        if input.UserInputType == Enum.UserInputType.MouseButton1 then
            value = not value
            updateToggle()
        end
    end)
    
    -- Container hover effects
    toggleContainer.MouseEnter:Connect(function()
        game:GetService("TweenService"):Create(toggleContainer, TweenInfo.new(0.2), {
            BackgroundColor3 = config.Theme.Primary
        }):Play()
    end)
    
    toggleContainer.MouseLeave:Connect(function()
        game:GetService("TweenService"):Create(toggleContainer, TweenInfo.new(0.2), {
            BackgroundColor3 = config.Theme.Secondary
        }):Play()
    end)
    
    return {
        SetValue = function(newValue)
            value = newValue
            updateToggle()
        end,
        GetValue = function()
            return value
        end
    }
end

-- Add a slider to a tab
function NeoUI:AddSlider(tabId, text, min, max, default, callback)
    local tab = self.Tabs[tabId]
    local value = default or min
    
    local sliderContainer = Instance.new("Frame")
    sliderContainer.Name = text.."Slider"
    sliderContainer.BackgroundColor3 = config.Theme.Secondary
    sliderContainer.BorderSizePixel = 0
    sliderContainer.Size = UDim2.new(1, -10, 0, config.ElementHeight + 15)
    sliderContainer.Parent = tab.Content
    
    local containerCorner = Instance.new("UICorner")
    containerCorner.CornerRadius = UDim.new(0, 6)
    containerCorner.Parent = sliderContainer
    
    local label = Instance.new("TextLabel")
    label.Name = "Label"
    label.BackgroundTransparency = 1
    label.Position = UDim2.new(0, 10, 0, 0)
    label.Size = UDim2.new(1, -70, 0, 25)
    label.Font = config.Font
    label.Text = text
    label.TextColor3 = config.Theme.Text
    label.TextSize = 14
    label.TextXAlignment = Enum.TextXAlignment.Left
    label.Parent = sliderContainer
    
    local valueLabel = Instance.new("TextLabel")
    valueLabel.Name = "Value"
    valueLabel.BackgroundTransparency = 1
    valueLabel.Position = UDim2.new(1, -60, 0, 0)
    valueLabel.Size = UDim2.new(0, 50, 0, 25)
    valueLabel.Font = config.Font
    valueLabel.Text = tostring(value)
    valueLabel.TextColor3 = config.Theme.Text
    valueLabel.TextSize = 14
    valueLabel.TextXAlignment = Enum.TextXAlignment.Right
    valueLabel.Parent = sliderContainer
    
    local sliderBg = Instance.new("Frame")
    sliderBg.Name = "Background"
    sliderBg.BackgroundColor3 = config.Theme.Primary
    sliderBg.BorderSizePixel = 0
    sliderBg.Position = UDim2.new(0, 10, 0, 30)
    sliderBg.Size = UDim2.new(1, -20, 0, 6)
    sliderBg.Parent = sliderContainer
    
    local sliderCorner = Instance.new("UICorner")
    sliderCorner.CornerRadius = UDim.new(1, 0)
    sliderCorner.Parent = sliderBg
    
    local sliderFill = Instance.new("Frame")
    sliderFill.Name = "Fill"
    sliderFill.BackgroundColor3 = config.Theme.Accent
    sliderFill.BorderSizePixel = 0
    sliderFill.Size = UDim2.new(0, 0, 1, 0)
    sliderFill.Parent = sliderBg
    
    local fillCorner = Instance.new("UICorner")
    fillCorner.CornerRadius = UDim.new(1, 0)
    fillCorner.Parent = sliderFill
    
    local sliderThumb = Instance.new("Frame")
    sliderThumb.Name = "Thumb"
    sliderThumb.BackgroundColor3 = config.Theme.Text
    sliderThumb.BorderSizePixel = 0
    sliderThumb.Position = UDim2.new(0, 0, 0.5, -7)
    sliderThumb.Size = UDim2.new(0, 14, 0, 14)
    sliderThumb.ZIndex = 2
    sliderThumb.Parent = sliderBg
    
    local thumbCorner = Instance.new("UICorner")
    thumbCorner.CornerRadius = UDim.new(1, 0)
    thumbCorner.Parent = sliderThumb
    
    -- Update slider position based on value
    local function updateSlider(newValue)
        value = math.clamp(newValue, min, max)
        
        -- Calculate percentage
        local percent = (value - min) / (max - min)
        
        -- Update fill and thumb position
        sliderFill.Size = UDim2.new(percent, 0, 1, 0)
        sliderThumb.Position = UDim2.new(percent, -7, 0.5, -7)
        
        -- Update value label
        valueLabel.Text = tostring(math.floor(value * 100) / 100)
        
        if callback then callback(value) end
    end
    
    -- Initial update
    updateSlider(value)
    
    -- Slider functionality
    local dragging = false
    
    sliderBg.InputBegan:Connect(function(input)
        if input.UserInputType == Enum.UserInputType.MouseButton1 then
            dragging = true
            
            -- Calculate value from mouse position
            local percent = math.clamp((input.Position.X - sliderBg.AbsolutePosition.X) / sliderBg.AbsoluteSize.X, 0, 1)
            local newValue = min + (max - min) * percent
            
            updateSlider(newValue)
        end
    end)
    
    sliderBg.InputEnded:Connect(function(input)
        if input.UserInputType == Enum.UserInputType.MouseButton1 then
            dragging = false
        end
    end)
    
    game:GetService("UserInputService").InputChanged:Connect(function(input)
        if dragging and input.UserInputType == Enum.UserInputType.MouseMovement then
            -- Calculate value from mouse position
            local percent = math.clamp((input.Position.X - sliderBg.AbsolutePosition.X) / sliderBg.AbsoluteSize.X, 0, 1)
            local newValue = min + (max - min) * percent
            
            updateSlider(newValue)
        end
    end)
    
    -- Container hover effects
    sliderContainer.MouseEnter:Connect(function()
        game:GetService("TweenService"):Create(sliderContainer, TweenInfo.new(0.2), {
            BackgroundColor3 = config.Theme.Primary
        }):Play()
    end)
    
    sliderContainer.MouseLeave:Connect(function()
        game:GetService("TweenService"):Create(sliderContainer, TweenInfo.new(0.2), {
            BackgroundColor3 = config.Theme.Secondary
        }):Play()
    end)
    
    return {
        SetValue = function(newValue)
            updateSlider(newValue)
        end,
        GetValue = function()
            return value
        end
    }
end

-- Add a label to a tab
function NeoUI:AddLabel(tabId, text)
    local tab = self.Tabs[tabId]
    
    local label = Instance.new("TextLabel")
    label.Name = "Label"
    label.BackgroundColor3 = config.Theme.Secondary
    label.BorderSizePixel = 0
    label.Size = UDim2.new(1, -10, 0, config.ElementHeight)
    label.Font = config.Font
    label.Text = text
    label.TextColor3 = config.Theme.Text
    label.TextSize = 14
    label.Parent = tab.Content
    
    local labelCorner = Instance.new("UICorner")
    labelCorner.CornerRadius = UDim.new(0, 6)
    labelCorner.Parent = label
    
    return {
        SetText = function(newText)
            label.Text = newText
        end,
        GetText = function()
            return label.Text
        end
    }
end

-- Show a notification
function NeoUI:Notify(title, message, type, duration)
    type = type or "info"
    duration = duration or 5
    
    local color
    if type == "success" then
        color = config.Theme.Success
    elseif type == "warning" then
        color = config.Theme.Warning
    elseif type == "error" then
        color = config.Theme.Error
    else
        color = config.Theme.Accent
    end
    
    -- Create notification container
    local notification = Instance.new("Frame")
    notification.Name = "Notification"
    notification.BackgroundColor3 = config.Theme.Secondary
    notification.BorderSizePixel = 0
    notification.Size = UDim2.new(0, 250, 0, 0)
    notification.ClipsDescendants = true
    notification.Parent = self.NotificationContainer
    
    local notifCorner = Instance.new("UICorner")
    notifCorner.CornerRadius = UDim.new(0, 8)
    notifCorner.Parent = notification
    
    -- Add a colored accent bar
    local accentBar = Instance.new("Frame")
    accentBar.Name = "AccentBar"
    accentBar.BackgroundColor3 = color
    accentBar.BorderSizePixel = 0
    accentBar.Position = UDim2.new(0, 0, 0, 0)
    accentBar.Size = UDim2.new(0, 4, 1, 0)
    accentBar.Parent = notification
    
    local accentCorner = Instance.new("UICorner")
    accentCorner.CornerRadius = UDim.new(0, 4)
    accentCorner.Parent = accentBar
    
    -- Add title
    local titleLabel = Instance.new("TextLabel")
    titleLabel.Name = "Title"
    titleLabel.BackgroundTransparency = 1
    titleLabel.Position = UDim2.new(0, 15, 0, 10)
    titleLabel.Size = UDim2.new(1, -25, 0, 20)
    titleLabel.Font = Enum.Font.GothamBold
    titleLabel.Text = title
    titleLabel.TextColor3 = config.Theme.Text
    titleLabel.TextSize = 14
    titleLabel.TextXAlignment = Enum.TextXAlignment.Left
    titleLabel.Parent = notification
    
    -- Add message
    local messageLabel = Instance.new("TextLabel")
    messageLabel.Name = "Message"
    messageLabel.BackgroundTransparency = 1
    messageLabel.Position = UDim2.new(0, 15, 0, 30)
    messageLabel.Size = UDim2.new(1, -25, 0, 40)
    messageLabel.Font = config.Font
    messageLabel.Text = message
    messageLabel.TextColor3 = config.Theme.Text
    messageLabel.TextSize = 14
    messageLabel.TextWrapped = true
    messageLabel.TextXAlignment = Enum.TextXAlignment.Left
    messageLabel.TextYAlignment = Enum.TextYAlignment.Top
    messageLabel.Parent = notification
    
    -- Close button
    local closeButton = Instance.new("TextButton")
    closeButton.Name = "CloseButton"
    closeButton.BackgroundTransparency = 1
    closeButton.Position = UDim2.new(1, -25, 0, 5)
    closeButton.Size = UDim2.new(0, 20, 0, 20)
    closeButton.Font = Enum.Font.GothamBold
    closeButton.Text = "×"
    closeButton.TextColor3 = config.Theme.Inactive
    closeButton.TextSize = 20
    closeButton.Parent = notification
    
    -- Animate notification in
    notification.Size = UDim2.new(0, 250, 0, 0)
    game:GetService("TweenService"):Create(notification, TweenInfo.new(0.3, Enum.EasingStyle.Quart, Enum.EasingDirection.Out), {
        Size = UDim2.new(0, 250, 0, 80)
    }):Play()
    
    -- Close button hover effects
    closeButton.MouseEnter:Connect(function()
        closeButton.TextColor3 = config.Theme.Error
    end)
    
    closeButton.MouseLeave:Connect(function()
        closeButton.TextColor3 = config.Theme.Inactive
    end)
    
    -- Function to close notification
    local function closeNotification()
        local closeTween = game:GetService("TweenService"):Create(notification, TweenInfo.new(0.3, Enum.EasingStyle.Quart, Enum.EasingDirection.Out), {
            Size = UDim2.new(0, 250, 0, 0),
            Position = UDim2.new(1, 20, 0, notification.Position.Y.Offset)
        })
        
        closeTween:Play()
        closeTween.Completed:Connect(function()
            notification:Destroy()
        end)
    end
    
    -- Close button click event
    closeButton.MouseButton1Click:Connect(closeNotification)
    
    -- Auto close after duration
    task.spawn(function()
        wait(duration)
        if notification and notification.Parent then
            closeNotification()
        end
    end)
    
    return notification
end

-- Close the UI
function NeoUI:Close()
    -- Animate closing
    local closeTween = game:GetService("TweenService"):Create(self.Main, TweenInfo.new(0.3, Enum.EasingStyle.Quart, Enum.EasingDirection.Out), {
        Size = UDim2.new(0, 400, 0, 0),
        Position = UDim2.new(0.5, -200, 0.5, 0)
    })
    
    closeTween:Play()
    closeTween.Completed:Connect(function()
        self.ScreenGui:Destroy()
    end)
end

-- Version checking function
function NeoUI:CheckForUpdates()
    -- Make sure HTTP requests are enabled in your game settings
    local success, result = pcall(function()
        local HttpService = game:GetService("HttpService")
        
        -- Replace with your actual GitHub repository URL
        local url = "https://raw.githubusercontent.com/yourusername/NeoUI/main/README.md"
        
        local response = HttpService:GetAsync(url)
        
        -- Parse the version from the README
        local version = response:match("## Version: ([%d%.]+)")
        
        return version
    end)
    
    if success and result then
        -- Compare versions
        local currentVersion = NeoUI.Version
        local latestVersion = result
        
        -- Simple version comparison
        local function compareVersions(v1, v2)
            local v1Parts = {}
            local v2Parts = {}
            
            for part in v1:gmatch("%d+") do
                table.insert(v1Parts, tonumber(part))
            end
            
            for part in v2:gmatch("%d+") do
                table.insert(v2Parts, tonumber(part))
            end
            
            for i = 1, math.max(#v1Parts, #v2Parts) do
                local v1Part = v1Parts[i] or 0
                local v2Part = v2Parts[i] or 0
                
                if v1Part > v2Part then
                    return 1
                elseif v1Part < v2Part then
                    return -1
                end
            end
            
            return 0
        end
        
        local versionComparison = compareVersions(currentVersion, latestVersion)
        
        if versionComparison < 0 then
            -- Current version is older than latest version
            self:Notify(
                "Update Available", 
                "A new version of NeoUI is available: v" .. latestVersion .. 
                "\nCurrent version: v" .. currentVersion, 
                "info", 
                10
            )
            return latestVersion
        else
            -- Current version is up to date or newer
            return currentVersion
        end
    else
        -- Failed to check for updates
        warn("Failed to check for updates: " .. tostring(result))
        return nil
    end
end

-- Return the module
return NeoUI
